package backendapp.myPizza.Models.entities;

import backendapp.myPizza.Models.enums.UserScope;
import backendapp.myPizza.Models.enums._2FAStrategy;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "users")
public class User implements UserDetails {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    private String firstName;

    private String lastName;

    private String email;

    private String hashPassword;

    private String phoneNumber;

    private String profileImage;

    private LocalDateTime createdAt;

    private LocalDateTime lastUpdate;

    public User(String firstName, String lastName, String email, String hashPassword, String phoneNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.hashPassword = hashPassword;
        this.phoneNumber = phoneNumber;
        this.scope = List.of(UserScope.USER);
        createdAt = LocalDateTime.now();
        lastUpdate = LocalDateTime.now();
    }

    @JsonIgnore
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Address> addresses = new ArrayList<>();

    private _2FAStrategy _2FA;
    @JsonIgnore

    private List<UserScope> scope;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        HashSet<GrantedAuthority> authorities = new HashSet<GrantedAuthority>(scope.size());

        for (UserScope s : scope)
            authorities.add(new SimpleGrantedAuthority(s.name()));
        return authorities;
    }

    @JsonIgnore
    @Override
    public String getPassword() {
        return null;
    }

    @JsonIgnore
    @Override
    public String getUsername() {
        return null;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
