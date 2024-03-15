package backendapp.myPizza.Models.entities;

import backendapp.myPizza.Models.enums.WorkSessionStatus;
import backendapp.myPizza.Models.enums.WorkSessionType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "work_sessions")
public class WorkSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private WorkSessionStatus status;

    @Enumerated(EnumType.STRING)
    private WorkSessionType type;

    private LocalDateTime openTime;

    private LocalDateTime closeTime;

    private int cookCount;


}
