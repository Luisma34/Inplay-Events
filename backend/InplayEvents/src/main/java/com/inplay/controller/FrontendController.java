package com.inplay.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    @RequestMapping(value = {
            "/{path:[^\\.]*}",
            "/{path:[^\\.]*}/{subpath:[^\\.]*}"
    })
    public String redirect() {
        return "forward:/index.html";
    }
}