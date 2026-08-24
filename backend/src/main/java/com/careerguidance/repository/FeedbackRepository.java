package com.careerguidance.repository;

import com.careerguidance.entity.Feedback;
import com.careerguidance.entity.FeedbackStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByStatusOrderByCreatedAtDesc(FeedbackStatus status);

    boolean existsByStudentIdAndStatus(Long studentId, FeedbackStatus status);
}
