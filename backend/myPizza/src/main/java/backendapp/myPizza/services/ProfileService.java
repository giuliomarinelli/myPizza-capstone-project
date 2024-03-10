package backendapp.myPizza.services;

import backendapp.myPizza.Models.entities.Address;
import backendapp.myPizza.Models.entities.Order;
import backendapp.myPizza.Models.entities.User;
import backendapp.myPizza.Models.reqDTO.UserPutDTO;
import backendapp.myPizza.Models.resDTO.ConfirmRes;
import backendapp.myPizza.exceptions.BadRequestException;
import backendapp.myPizza.exceptions.UnauthorizedException;
import backendapp.myPizza.repositories.AddressRepository;
import backendapp.myPizza.repositories.CityRepository;
import backendapp.myPizza.repositories.UserRepository;
import backendapp.myPizza.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRp;

    @Autowired
    private AddressRepository addressRp;

    @Autowired
    private CityRepository cityRp;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder encoder;


    public User get() throws UnauthorizedException {
        UUID userId = jwtUtils.extractUserIdFromReq();
        return userRp.findById(userId).orElseThrow(
                () -> new UnauthorizedException("Invalid access token and refresh token")
        );
    }

    public ConfirmRes changePassword(String oldPassword, String newPassword) throws UnauthorizedException, BadRequestException {
        UUID userId = jwtUtils.extractUserIdFromReq();
        User u = userRp.findById(userId).orElseThrow(
                () -> new UnauthorizedException("Invalid access token and refresh token")
        );
        if (!encoder.matches(oldPassword, u.getHashPassword()))
            throw new BadRequestException("oldPassword is not correct, cannot change password");
        u.setHashPassword(encoder.encode(newPassword));
        userRp.save(u);
        return new ConfirmRes("Password has been correctly changed", HttpStatus.OK);
    }

    public User put(UserPutDTO userPutDTO) throws UnauthorizedException, BadRequestException {
        UUID userId = jwtUtils.extractUserIdFromReq();
        User u = userRp.findById(userId).orElseThrow(
                () -> new UnauthorizedException("Invalid access token and refresh token")
        );
        u.setLastUpdate(LocalDateTime.now());
        u.setFirstName(userPutDTO.firstName());
        u.setLastName(userPutDTO.lastName());
        u.setEmail(userPutDTO.email());
        u.setPhoneNumber(userPutDTO.phoneNumber());
        u.setGender(userPutDTO.gender());
        try {
            userRp.save(u);
        } catch (DataIntegrityViolationException e) {
            if (userRp.findAllEmails().contains(u.getEmail()) || userRp.findAllPhoneNumbers().contains(u.getPhoneNumber())) {
                throw new BadRequestException("Email and/or phoneNumber already exist. Cannot update");
            }
        }
        return u;
    }

    public List<Address> getAddresses() throws UnauthorizedException {
        UUID userId = jwtUtils.extractUserIdFromReq();
        User u = userRp.findById(userId).orElseThrow(
                () -> new UnauthorizedException("Invalid access token and refresh token")
        );
        return u.getAddresses();
    }

    public List<Order> getOrders() throws UnauthorizedException {
        UUID userId = jwtUtils.extractUserIdFromReq();
        User u = userRp.findById(userId).orElseThrow(
                () -> new UnauthorizedException("Invalid access token and refresh token")
        );
        return u.getOrders();
    }

    public ConfirmRes delete() throws UnauthorizedException {
        UUID userId = jwtUtils.extractUserIdFromReq();
        User u = userRp.findById(userId).orElseThrow(
                () -> new UnauthorizedException("Invalid access token and refresh token")
        );
        for (Address address : u.getAddresses()) {
            addressRp.delete(address);
        }
        userRp.delete(u);
        return new ConfirmRes("User successfully deleted", HttpStatus.NO_CONTENT);
    }


}