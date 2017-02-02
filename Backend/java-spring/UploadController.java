package org.sigmoid.amn.controller;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.Base64;

/**
 * Created by mostafa on 1/16/17.
 */
@Controller
public class PostController {



    @RequestMapping(path = "/upload/{index}/{is_end}/{filename}", method = RequestMethod.POST)
    @ResponseBody
    public String uploadFilePart(@RequestBody String payload, @PathVariable int index,
                                 @PathVariable boolean is_end, @PathVariable String filename) {

        System.out.println(">>>>>>>>");
        System.out.println(payload);
        try {

            FileOutputStream output = new FileOutputStream("./src/main/resources/public/uploaded/"+filename, true);
            try {
                output.write(Base64.getDecoder().decode(payload));
            } finally {
                output.close();
            }




        } catch (IOException e) {
            e.printStackTrace();
        }

        return "{\"success\": \"true\", \"url\": \"http://localhost:8080/uploaded/"+filename+"\"}";

    }




}
