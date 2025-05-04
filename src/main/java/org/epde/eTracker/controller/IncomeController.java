package org.epde.eTracker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IncomeController {
    @GetMapping("/income")
    public String incomePage() {
        return "income";
    }
}
