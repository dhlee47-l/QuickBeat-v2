package com.lec.spring.controller;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MainController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/shuffle")
    public String shuffle() {
        return "shuffle";
    }

    @GetMapping("/qr")
    public String showQr(@RequestParam(required = false) String id, Model model) {
        if (id != null) {
            model.addAttribute("answerId", id);
        }
        return "qr";
    }

    @GetMapping("/quiz")
    public String quiz() {
        return "quiz";
    }
}
