package org.epde.eTracker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ExpenseTrackerController {

    @GetMapping("/")
    public String home() {
        return "dashboard";
    }

    @GetMapping("/income")
    public String incomePage() {
        return "income";
    }

    @GetMapping("/expense")
    public String expensePage() {
        return "expense";
    }

}
