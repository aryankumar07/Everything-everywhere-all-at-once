package com.aryan.app.service;


import com.aryan.app.model.JobPost;
import com.aryan.app.repo.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepo;

    public List<JobPost> getAllPost() {
        return jobRepo.getAllJob();
    }

    public void addJob(JobPost jobPost) {
        jobRepo.addJob(jobPost);
    }

}
