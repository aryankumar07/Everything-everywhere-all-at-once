package com.aryan.rest.service;


import com.aryan.rest.model.JobPost;
import com.aryan.rest.repo.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepo;

    public List<JobPost> getAllPost() {
        return jobRepo.findAll();
    }

    public JobPost getJobById(int postId) {
        return jobRepo.findById(postId).orElse(null);
    }

    public JobPost addJob(JobPost jobPost) {
        jobRepo.save(jobPost);
        return jobPost;
    }

    public JobPost updateJob(JobPost jobPost) {
        jobRepo.save(jobPost);
        return  jobPost;
    }

    public  int deleteJob(int postId) {
        Optional<JobPost> job = jobRepo.findById(postId);
        if(job.isPresent()) {
            jobRepo.delete(job.get());
        }
        return  postId;
    }

}
