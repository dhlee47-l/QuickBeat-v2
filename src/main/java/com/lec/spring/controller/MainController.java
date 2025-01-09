package com.lec.spring.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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
    public String qr() {
        return "qr";
    }
}
