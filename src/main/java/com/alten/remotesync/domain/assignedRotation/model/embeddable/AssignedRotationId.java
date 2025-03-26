package com.alten.remotesync.domain.assignedRotation.model.embeddable;



import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.rotation.model.Rotation;
import com.alten.remotesync.domain.user.model.User;
import jakarta.persistence.Embeddable;
import jakarta.persistence.ManyToOne;
import lombok.*;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignedRotationId implements Serializable {
    @ManyToOne
    private User user;

    @ManyToOne
    private Rotation rotation;

    @ManyToOne
    private Project project;
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AssignedRotationId that = (AssignedRotationId) o;
        return Objects.equals(user, that.user) &&
                Objects.equals(rotation, that.rotation) &&
                Objects.equals(project, that.project);
    }
    @Override
    public int hashCode() {
        return Objects.hash(user, rotation, project);
    }
}