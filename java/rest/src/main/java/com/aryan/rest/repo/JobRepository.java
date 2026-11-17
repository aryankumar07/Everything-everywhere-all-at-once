package com.aryan.rest.repo;

import com.aryan.rest.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Repository
public interface JobRepository extends JpaRepository<JobPost , Integer> { }
