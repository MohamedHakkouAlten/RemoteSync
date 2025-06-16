package com.alten.remotesync.application.notification.service;

import com.alten.remotesync.adapter.exception.notification.NotificationNotFoundException;
import com.alten.remotesync.adapter.exception.report.ReportNotFoundException;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.notification.mapper.NotificationMapper;
import com.alten.remotesync.application.notification.record.request.NotificationByStatusDTO;
import com.alten.remotesync.application.notification.record.request.PagedNotificationSearchDTO;
import com.alten.remotesync.application.notification.record.response.NotificationDTO;
import com.alten.remotesync.application.notification.record.response.PagedNotificationDTO;
import com.alten.remotesync.application.report.record.response.PagedReportDTO;
import com.alten.remotesync.domain.notification.model.Notification;
import com.alten.remotesync.domain.notification.repository.NotificationDomainRepository;
import com.alten.remotesync.domain.report.model.Report;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class NotificationServiceImp implements NotificationService {
    private final NotificationDomainRepository notificationDomainRepository;
    private final NotificationMapper notificationMapper;

    @Override
    public PagedNotificationDTO getAssociateNotifications(PagedNotificationSearchDTO pagedNotificationSearchDTO) {
        Specification<Notification> spec = (root, query, cb) -> {
            if (query.getRestriction() == null || query.getRestriction().getExpressions().isEmpty()) {
                 query.orderBy(cb.desc(root.get("createdAt")));
            }
          return  cb.equal(root.get("receiver").get("userId"), pagedNotificationSearchDTO.userId());
        };

        if (pagedNotificationSearchDTO.title() != null && !pagedNotificationSearchDTO.title().isBlank()) {
            String title = pagedNotificationSearchDTO.title().trim().toLowerCase();
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("title")), "%" + title + "%")
            );
        }

        if (pagedNotificationSearchDTO.status() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), pagedNotificationSearchDTO.status())
            );
        }

        if (pagedNotificationSearchDTO.createdAt() != null) {
            LocalDateTime startOfDay = pagedNotificationSearchDTO.createdAt().atStartOfDay();
            LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1); // End of the day
            spec = spec.and((root, query, cb) ->
                    cb.between(root.get("createdAt"), startOfDay, endOfDay)
            );
        }


        Page<Notification> pagedNotifications = notificationDomainRepository.findAll(
                spec,
                PageRequest.of(
                        pagedNotificationSearchDTO.pageNumber(),
                        pagedNotificationSearchDTO.pageSize() != null ? pagedNotificationSearchDTO.pageSize() : 10,
                        Sort.by(Sort.Direction.DESC, "createdAt")
                )
        );

        return new PagedNotificationDTO(
                pagedNotifications.getContent().stream().map(notificationMapper::toNotificationDTO).toList(),
                pagedNotifications.getTotalPages(),
                pagedNotifications.getTotalElements(),
                pagedNotificationSearchDTO.pageNumber() + 1,
                pagedNotificationSearchDTO.pageSize()
        );
    }





    @Override
    public Long countTotalAssociateNotificationsByStatus(NotificationByStatusDTO notificationByStatusDTO) {
        Specification<Notification> spec = (root, query, cb) ->
            cb.equal(root.get("receiver").get("userId"), notificationByStatusDTO.userId());
            if (notificationByStatusDTO.notificationStatus() != null){
                spec =spec.and((root, query, cb) ->
                       root.get("status").in(notificationByStatusDTO.notificationStatus())
                );
        }
        return notificationDomainRepository.count(spec);
    }

    @Override
    public Long countUnreadNotifications(UUID userId) {
        Specification<Notification> spec = (root, query, cb) ->
                cb.equal(root.get("receiver").get("userId"), userId);

            spec =spec.and((root, query, cb) ->
                  cb.equal(root.get("isRead"),false)
            );

        return notificationDomainRepository.count(spec);
    }

    @Override
    public void setNotificationAsRead(String notificationId) {
        Notification notification=notificationDomainRepository.findById(UUID.fromString(notificationId)).orElseThrow(()->new NotificationNotFoundException("Notification not found"));
        notification.setIsRead(true);
        notificationDomainRepository.save(notification);
    }

    @Override
    public void markAllNotificationAsRead(UUID userId) {
        List<Notification> unReadNotifications=notificationDomainRepository.findAllByIsRead(false);
        for(Notification notification:unReadNotifications){
            notification.setIsRead(true);
        }
        notificationDomainRepository.saveAll(unReadNotifications);
    }
}
