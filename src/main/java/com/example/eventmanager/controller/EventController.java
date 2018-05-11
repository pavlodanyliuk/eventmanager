package com.example.eventmanager.controller;

import com.example.eventmanager.domain.Event;
import com.example.eventmanager.domain.EventView;
import com.example.eventmanager.domain.User;
import com.example.eventmanager.service.EmailService;
import com.example.eventmanager.service.EventService;
import com.example.eventmanager.service.ExportEventService;
import com.example.eventmanager.service.UserService;
import com.fasterxml.jackson.annotation.JsonView;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.activation.DataSource;
import javax.mail.MessagingException;
import javax.mail.util.ByteArrayDataSource;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping(value = "/event")
public class EventController {

    private final EventService eventService;
    private final ExportEventService exportService;
    private final UserService userService;
    private final Logger logger = LogManager.getLogger(EventController.class);

    @Autowired
    public EventController(EventService eventService, ExportEventService exportService, UserService userService) {
        logger.info("Class initialized");

        this.userService = userService;

        this.exportService = exportService;
        this.eventService = eventService;
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<Long> createEvent(@RequestBody Event event, UriComponentsBuilder ucBuilder) {
        logger.info("POST /");
        eventService.createEvent(event);
        return new ResponseEntity<>(event.getId(), HttpStatus.CREATED);
    }

    @JsonView(EventView.ShortView.class)
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<List<Event>> listAllPublicEvent() {
        logger.info("GET /");

        List<Event> events = eventService.getAllPublicEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @JsonView(EventView.FullView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<Event> getEvent(@PathVariable("id") Long id) {
        logger.info("GET /" + id);

        Event event = eventService.getEvent(id);
        if (event == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    @JsonView(EventView.FullView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.POST)
    public ResponseEntity<Event> updateEvent(@PathVariable("id") Long id, @RequestBody Event newEvent) {
        logger.info("POST /" + id);

        Event oldEvent = eventService.getEvent(id);
        if (oldEvent == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        newEvent.setId(oldEvent.getId());
        newEvent.setCreator(oldEvent.getCreator());
        eventService.updateEvent(newEvent);
        return new ResponseEntity<>(newEvent, HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteEvent(@PathVariable("id") Long id) {
        logger.info("DELETE /" + id);

        Event event = eventService.getEvent(id);
        if (event == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        eventService.deleteEvent(event);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @RequestMapping(value = "/{id}/participants", method = RequestMethod.GET)
    public ResponseEntity<List<User>> getParticipants(@PathVariable Long id) {
        logger.info("GET /" + id + "/participants");

        List<User> userList = eventService.getParticipants(id);
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/join", method = RequestMethod.GET)
    public void join(@PathVariable Long id) {
        logger.info("POST /join");
        eventService.joinToEvent(id);
    }

    @RequestMapping(value = "{id}/participants", method = RequestMethod.POST)
    public void addParticipants(@RequestBody List<User> users, @PathVariable Long id) {
        logger.info("POST /add Participants");

        eventService.AddUsersToEvent(users, id);
    }

    @RequestMapping(value = "/downloadPlan", method = RequestMethod.GET)
    public void downloadEventsPlan(@RequestParam String from, @RequestParam String to, HttpServletResponse response) throws IOException, JRException {
        logger.info("GET /downloadPlan");

        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);

        JasperPrint eventsPlan = exportService.eventsPlanForExport(fromDate, toDate);
        final OutputStream outputStream = response.getOutputStream();
        JasperExportManager.exportReportToPdfStream(eventsPlan, outputStream);


    }

    @RequestMapping(value = "/sendPlan", method = RequestMethod.GET)
    public void sendEventsPlan(@RequestParam String from, @RequestParam String to) {
        logger.info("GET /sendPlan");
        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);
        JasperPrint eventsPlan = exportService.eventsPlanForExport(fromDate, toDate);
        String email =  userService.getCurrentUser().getEmail();
        exportService.sendEventsPlan(email,eventsPlan,fromDate,toDate);
}

    @RequestMapping(value = "{id}/priority", method = RequestMethod.GET)
    public String getPriority(@PathVariable Long id) {
        logger.info("GET /EventPriority");
        return eventService.getPriority(id);
    }

    @RequestMapping(value = "{id}/priority/change", method = RequestMethod.GET)
    public void getPriority(@PathVariable Long id, @RequestParam Long priority_id) {
        logger.info("GET /EventPriority");
        eventService.changePriority(id, priority_id);
    }

    @RequestMapping(value = "{id}/isParticipant", method = RequestMethod.GET)
    public boolean isParticipant(@PathVariable Long id) {
        logger.info("GET /isParticipant");
        return eventService.isParticipant(id);
    }

    @RequestMapping(value = "{id}/leave", method = RequestMethod.GET)
    public void leave(@PathVariable Long id) {
        logger.info("GET /leave");
         eventService.leaveEvent(id);
    }

}

