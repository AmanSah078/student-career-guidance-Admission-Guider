package com.careerguidance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "programs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "education_path", nullable = false, length = 30)
    private EducationPath educationPath;

    @Column(length = 500)
    private String shortDescription;

    @Column(length = 50)
    private String duration;

    @Column(length = 150)
    private String eligibility;

    @Column(columnDefinition = "TEXT")
    private String overview;

    @Column(name = "what_you_will_study", columnDefinition = "TEXT")
    private String whatYouWillStudy;

    @Column(name = "why_choose", columnDefinition = "TEXT")
    private String whyChoose;

    @Column(name = "admission_process", columnDefinition = "TEXT")
    private String admissionProcess;

    @Column(name = "study_mode", length = 50)
    private String studyMode;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Builder.Default
    @ManyToMany(mappedBy = "handledPrograms", fetch = FetchType.LAZY)
    private java.util.Set<Counsellor> counsellors = new java.util.HashSet<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
