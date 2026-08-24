package com.careerguidance.repository;

import com.careerguidance.entity.Counsellor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CounsellorRepository extends JpaRepository<Counsellor, Long> {
    List<Counsellor> findByActiveTrueOrderByDisplayOrderAsc();
    List<Counsellor> findByHandledProgramsIdAndActiveTrueOrderByDisplayOrderAsc(Long programId);
    java.util.Optional<Counsellor> findByName(String name);
}
