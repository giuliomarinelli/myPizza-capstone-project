package it.epicode.backend.bwii.epic_energy_services.Models.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "international_prefixes")
public class InternationalPrefix {
    private String prefix;
}
