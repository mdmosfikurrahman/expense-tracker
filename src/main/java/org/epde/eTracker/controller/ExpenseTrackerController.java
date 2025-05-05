package org.epde.eTracker.controller;

import jakarta.servlet.http.HttpSession;
import org.epde.eTracker.dto.response.AuthResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ExpenseTrackerController {

    @GetMapping("/")
    public String dashboard(HttpSession session, Model model) {
        AuthResponse user = (AuthResponse) session.getAttribute("loggedInUser");
        if (user == null) {
            return "redirect:/login";
        }

        model.addAttribute("user", user);
        return "dashboard";
    }

    @GetMapping("/login")
    public String loginPage(HttpSession session) {
        if (session.getAttribute("loggedInUser") != null) {
            return "redirect:/";
        }
        return "login";
    }

    @GetMapping("/register")
    public String registerPage(HttpSession session) {
        if (session.getAttribute("loggedInUser") != null) {
            return "redirect:/";
        }
        return "register";
    }

    @GetMapping("/income")
    public String incomePage(HttpSession session, Model model) {
        AuthResponse user = (AuthResponse) session.getAttribute("loggedInUser");
        if (user == null) {
            return "redirect:/login";
        }

        model.addAttribute("user", user);
        return "income";
    }

    @GetMapping("/expense")
    public String expensePage(HttpSession session, Model model) {
        AuthResponse user = (AuthResponse) session.getAttribute("loggedInUser");
        if (user == null) {
            return "redirect:/login";
        }

        model.addAttribute("user", user);
        return "expense";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
