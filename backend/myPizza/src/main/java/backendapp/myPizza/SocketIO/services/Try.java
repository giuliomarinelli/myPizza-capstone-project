package backendapp.myPizza.SocketIO.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.UUID;

//@Component
public class Try implements CommandLineRunner {
    @Autowired
    private SessionTrackingService trackingSvc;

    @Override
    public void run(String... args) throws Exception {
        System.out.println(trackingSvc.getSessionTracker());
        UUID userId1 = UUID.fromString("e763e905-6efe-49e9-aaf1-483b1417aa58");
        UUID sid11 = UUID.fromString("995251fe-de1c-4e61-8138-aab0e0da03f0");
        UUID sid12 = UUID.fromString("50543d5e-5814-4f3e-97ed-9da30ed6638c");
        trackingSvc.addSession(userId1, sid11);
        System.out.println(trackingSvc.getSessionTracker());
        trackingSvc.addSession(userId1, sid12);
        System.out.println(trackingSvc.getSessionTracker());
        UUID userId2 = UUID.fromString("cf77a61e-fc0f-49ab-822e-b991f79c4ac6");
        UUID sid21 = UUID.fromString("82708145-d23a-4eec-bde4-4bdb2e510138");
        trackingSvc.addSession(userId2, sid21);
        System.out.println(trackingSvc.getSessionTracker());
        trackingSvc.removeSession(sid21);
        System.out.println(trackingSvc.getSessionTracker());
        trackingSvc.removeSession(sid12);
        System.out.println(trackingSvc.getSessionTracker());
        trackingSvc.removeSession(sid11);
        System.out.println(trackingSvc.getSessionTracker());

    }
}
