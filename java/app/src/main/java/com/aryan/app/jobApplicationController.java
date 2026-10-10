package com.aryan.app;


import com.aryan.app.model.JobPost;
import com.aryan.app.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class jobApplicationController {

    @Autowired
    private JobService jobService;

    @RequestMapping({"/" , "home"})
    public String home() {
        return "home";
    }

    @GetMapping("addjob")
    public String addJob() {
        return "addjob";
    }

    @PostMapping("handleForm")
    public String handleForm(JobPost jobPost) {
        jobService.addJob(jobPost);
        return "success";
    }

    @GetMapping("viewalljobs")
    public ModelAndView getAllJobs() {
        ModelAndView mv = new ModelAndView("viewalljobs");
        mv.addObject("jobPosts", jobService.getAllPost());
        return mv;
    }



}
