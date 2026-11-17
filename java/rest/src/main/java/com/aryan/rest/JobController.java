package com.aryan.rest;


import com.aryan.rest.model.JobPost;
import com.aryan.rest.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping("/jobs")
    @ResponseBody
    public List<JobPost> fetchAllJobs() {
        return jobService.getAllPost();
    }

    @GetMapping("/jobs/{postId}")
    public JobPost getJobById(@PathVariable("postId") int postId) {
        return jobService.getJobById(postId);
    }

    @PostMapping("/addJob")
    @ResponseBody
    public JobPost addJob(@RequestBody JobPost jobPost) {
        JobPost newJob = jobService.addJob(jobPost);
        return newJob;
    }

    @PutMapping("/addJob")
    @ResponseBody
    public JobPost updateJob(@RequestBody JobPost jobPost) {
        jobService.updateJob(jobPost);
        return jobPost;
    }

    @DeleteMapping("/deleteJob/{postId}")
    @ResponseBody
    public int deleteJob(@PathVariable("postId") int postId) {
        jobService.deleteJob(postId);
        return postId;
    }


}
