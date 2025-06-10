package com.alten.remotesync.infrastructure.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class MailUtility {
    @Value("${spring.application.name}")
    public String applicationName;

    @Value("${spring.application.logoURL}")
    public String applicationLogoUrl;

    @Value("${spring.application.supportMail}")
    public String applicationSupportEmail;

    @Value("${spring.application.domainURL}")
    public String applicationDomainUrl;

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String to, String subject, String text, boolean isHtml) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(applicationSupportEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, isHtml);

        javaMailSender.send(message);
    }
}
