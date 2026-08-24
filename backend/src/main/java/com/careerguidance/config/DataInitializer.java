package com.careerguidance.config;

import com.careerguidance.entity.Counsellor;
import com.careerguidance.entity.EducationPath;
import com.careerguidance.entity.Feedback;
import com.careerguidance.entity.FeedbackStatus;
import com.careerguidance.entity.Program;
import com.careerguidance.entity.Student;
import com.careerguidance.repository.FeedbackRepository;
import com.careerguidance.repository.ProgramRepository;
import com.careerguidance.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final ProgramRepository programRepository;
    private final com.careerguidance.repository.CounsellorRepository counsellorRepository;
    private final StudentRepository studentRepository;
    private final FeedbackRepository feedbackRepository;

    public DataInitializer(ProgramRepository programRepository,
                           com.careerguidance.repository.CounsellorRepository counsellorRepository,
                           StudentRepository studentRepository,
                           FeedbackRepository feedbackRepository) {
        this.programRepository = programRepository;
        this.counsellorRepository = counsellorRepository;
        this.studentRepository = studentRepository;
        this.feedbackRepository = feedbackRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("Initializing & updating admission-focused program details catalog in MySQL...");

        seedOrUpdateProgram(
            "BSC",
            "B.Sc - Bachelor of Science",
            EducationPath.GRADUATION,
            "Build a strong foundation in physical, biological, or computer sciences with diverse career and research opportunities.",
            "3 Years",
            "10+2 Science Stream (PCB / PCM)",
            "Regular / Full-Time",
            "The Bachelor of Science (B.Sc) is an undergraduate degree program designed for students passionate about science, analytical reasoning, research, and technical applications. The program provides comprehensive theoretical understanding combined with practical laboratory experiments across core science specializations.",
            "Physics, Chemistry, Mathematics, Computer Science, Biology, Environmental Studies, Scientific Computing, Research Methodology",
            "Develop strong problem-solving and analytical thinking skills. Opens direct pathways to higher studies (M.Sc/Ph.D), government scientific research organizations, IT industries, and competitive examinations.",
            "1. Submit your online admission enquiry.\n2. Connect with our admission counselling team.\n3. Verify your 10+2 stream eligibility and certificate documents.\n4. Complete seat confirmation and college admission guidelines.",
            1
        );

        seedOrUpdateProgram(
            "BA",
            "B.A - Bachelor of Arts",
            EducationPath.GRADUATION,
            "Explore humanities, social sciences, languages, and creative disciplines with wide civil service and career scope.",
            "3 Years",
            "10+2 Any Recognized Stream",
            "Regular / Full-Time",
            "The Bachelor of Arts (B.A) degree program offers broad knowledge across liberal arts, literature, social sciences, and humanities. It encourages critical thinking, effective communication, cultural awareness, and interdisciplinary analysis suited for diverse public and private sector opportunities.",
            "English Literature, History, Political Science, Economics, Sociology, Psychology, Public Administration, General Communication",
            "Ideal foundation for Civil Services (UPSC/State PSC), journalism, law, teaching, corporate communications, and social sector careers with maximum flexibility.",
            "1. Submit your online admission enquiry.\n2. Connect with our admission counselling team.\n3. Discuss specialization subject choices.\n4. Finalize application document submission.",
            2
        );

        seedOrUpdateProgram(
            "BED",
            "B.Ed - Bachelor of Education",
            EducationPath.GRADUATION,
            "Professional degree program designed for aspiring educators and teaching career opportunities.",
            "2 Years",
            "Bachelor Degree with minimum 50% Marks",
            "Regular / Full-Time",
            "The Bachelor of Education (B.Ed) is a professional NCTE-approved degree program mandated for individuals aspiring to teach at secondary and senior secondary school levels. It focuses on modern pedagogy, educational psychology, classroom management, and practical teaching internship experience.",
            "Educational Psychology, Pedagogy of School Subjects, Classroom Management, Educational Technology, Assessment & Evaluation, School Internship",
            "Essential credential for government teaching recruitments (CTET/STET), reputed private international schools, educational consultancy, and academic leadership.",
            "1. Submit your online admission enquiry.\n2. Connect with our admission team to check graduation eligibility.\n3. Submit graduation marksheets for merit validation.\n4. Secure your admission seat.",
            3
        );

        seedOrUpdateProgram(
            "DELED",
            "D.El.Ed - Diploma in Elementary Education",
            EducationPath.COURSES,
            "Professional diploma training for primary school teaching certification.",
            "2 Years",
            "10+2 with minimum 50% Marks",
            "Regular / Full-Time",
            "The Diploma in Elementary Education (D.El.Ed) is a practical 2-year teacher training course that equips candidates with skills to teach elementary and primary school students (Classes 1 to 8). The course emphasizes child development, foundational literacy, and interactive teaching techniques.",
            "Child Development & Pedagogy, Environmental Studies Teaching, Primary Mathematics Education, Language Teaching Skills, Practical School Teaching Practice",
            "Direct qualification for primary school teacher recruitment exams (CTET/TET) and elementary school educator positions in government and private sectors.",
            "1. Submit your online admission enquiry.\n2. Connect with our admission counselling team.\n3. Verify your 10+2 board marksheet.\n4. Complete registration and enrollment formalities.",
            1
        );

        seedOrUpdateProgram(
            "ITI",
            "ITI - Industrial Training Institute",
            EducationPath.COURSES,
            "Vocational skill training programs in electrical, mechanical, and technical trades.",
            "1 - 2 Years",
            "10th Pass from Recognized Board",
            "Full-Time Technical Workshop",
            "Industrial Training Institute (ITI) courses provide practical, skill-focused technical training across essential industrial trades such as Electrician, Fitter, Mechanic, Machinist, and Welder. Designed for immediate employment, ITI emphasizes hands-on workshop experience.",
            "Trade Theory, Practical Workshop Practice, Engineering Drawing, Workshop Calculation & Science, Employability & Industry Safety Skills",
            "High demand in railway recruitment, public sector undertakings (PSUs like BHEL/NTPC), manufacturing units, auto industries, and self-employment trade workshops.",
            "1. Submit your online admission enquiry.\n2. Connect with our admission team to choose trade specialization.\n3. Verify 10th pass marksheets.\n4. Complete workshop seat allocation.",
            2
        );

        seedOrUpdateProgram(
            "POLYTECHNIC",
            "Polytechnic - Diploma in Engineering",
            EducationPath.COURSES,
            "Hands-on technical diploma programs preparing for engineering careers and lateral degree entry.",
            "3 Years",
            "10th Pass with Science & Mathematics",
            "Regular / Full-Time",
            "Polytechnic Engineering Diplomas offer technical education in branches like Civil, Mechanical, Electrical, Electronics, and Computer Engineering. It combines practical engineering labs with foundational theory, enabling direct employment as Junior Engineers.",
            "Applied Mathematics & Physics, Engineering Graphics, Electrical/Mechanical Workshop Labs, Computer Programming, Branch Specialization Subjects",
            "Offers dual benefit: direct Junior Engineer employment in government/private firms, plus lateral entry opportunity directly into the 2nd year of B.Tech/B.E. degree.",
            "1. Submit your online admission enquiry.\n2. Connect with our admission team to select engineering branch.\n3. Verify 10th marksheet and eligibility.\n4. Confirm your engineering diploma seat.",
            3
        );

        logger.info("Database catalog programs initialized and synchronized successfully.");

        seedCounsellors();
        seedFeedback();
    }

    private void seedFeedback() {
        if (feedbackRepository.count() == 0) {
            logger.info("Seeding initial approved student feedback into MySQL...");

            Student demoStudent1 = studentRepository.findByEmail("rohan.sharma@example.com").orElseGet(() -> {
                Student s = Student.builder()
                        .fullName("Rohan Sharma")
                        .email("rohan.sharma@example.com")
                        .phone("9876543210")
                        .password("hashed_password_placeholder")
                        .verified(true)
                        .educationPath(EducationPath.GRADUATION)
                        .build();
                return studentRepository.save(s);
            });

            Student demoStudent2 = studentRepository.findByEmail("ananya.verma@example.com").orElseGet(() -> {
                Student s = Student.builder()
                        .fullName("Ananya Verma")
                        .email("ananya.verma@example.com")
                        .phone("9876543211")
                        .password("hashed_password_placeholder")
                        .verified(true)
                        .educationPath(EducationPath.COURSES)
                        .build();
                return studentRepository.save(s);
            });

            Student demoStudent3 = studentRepository.findByEmail("priya.patel@example.com").orElseGet(() -> {
                Student s = Student.builder()
                        .fullName("Priya Patel")
                        .email("priya.patel@example.com")
                        .phone("9876543212")
                        .password("hashed_password_placeholder")
                        .verified(true)
                        .educationPath(EducationPath.GRADUATION)
                        .build();
                return studentRepository.save(s);
            });

            Feedback f1 = Feedback.builder()
                    .student(demoStudent1)
                    .rating(5)
                    .message("SeniorGuide helped me understand the real scope of B.Sc and career opportunities. The admission counsellor gave me complete clarity!")
                    .status(FeedbackStatus.APPROVED)
                    .build();

            Feedback f2 = Feedback.builder()
                    .student(demoStudent2)
                    .rating(5)
                    .message("I was confused between a 3-year degree and a technical polytechnic course. The platform guided me through the exact eligibility and process.")
                    .status(FeedbackStatus.APPROVED)
                    .build();

            Feedback f3 = Feedback.builder()
                    .student(demoStudent3)
                    .rating(5)
                    .message("Connecting with an actual admission counsellor through the platform saved me so much time. Transparent guidance and smooth experience!")
                    .status(FeedbackStatus.APPROVED)
                    .build();

            feedbackRepository.saveAll(List.of(f1, f2, f3));
            logger.info("Successfully seeded 3 approved student feedback testimonials.");
        }
    }

    private void seedCounsellors() {
        logger.info("Synchronizing official admission advisors (Shayam Kumar Yadav & Karunakar Pandey)...");

        Program bsc = programRepository.findByCode("BSC").orElse(null);
        Program ba = programRepository.findByCode("BA").orElse(null);
        Program bed = programRepository.findByCode("BED").orElse(null);
        Program deled = programRepository.findByCode("DELED").orElse(null);
        Program iti = programRepository.findByCode("ITI").orElse(null);
        Program polytechnic = programRepository.findByCode("POLYTECHNIC").orElse(null);

        List<Counsellor> existing = counsellorRepository.findAll();

        Counsellor c1;
        Counsellor c2;

        if (existing.size() >= 1) {
            c1 = existing.get(0);
        } else {
            c1 = new Counsellor();
        }

        c1.setName("Shayam Kumar Yadav");
        c1.setDesignation("Head of Admissions & Academic Guidance");
        c1.setProfileImage("SY");
        c1.setExperience("7+ Years Experience");
        c1.setPhone("6205606097");
        c1.setEmail("syo209514@gmail.com");
        c1.setBio("Dedicated senior admission advisor guiding students across undergraduate degree programs (B.Sc, B.A, B.Ed), college stream selection, eligibility verification, and authentic career pathways.");
        c1.setDisplayOrder(1);
        c1.setActive(true);
        c1.setHandledPrograms(new java.util.HashSet<>(java.util.Arrays.asList(bsc, ba, bed).stream().filter(java.util.Objects::nonNull).toList()));
        counsellorRepository.save(c1);

        if (existing.size() >= 2) {
            c2 = existing.get(1);
        } else {
            c2 = new Counsellor();
        }

        c2.setName("Karunakar Pandey");
        c2.setDesignation("Lead Technical & Vocational Admissions Advisor");
        c2.setProfileImage("KP");
        c2.setExperience("8+ Years Experience");
        c2.setPhone("9576997103");
        c2.setEmail("golubabusiwan@gmail.com");
        c2.setBio("Specialist technical admission counselor guiding students in diploma engineering (Polytechnic), ITI vocational trade programs, elementary teacher education (D.El.Ed), and direct career opportunities.");
        c2.setDisplayOrder(2);
        c2.setActive(true);
        c2.setHandledPrograms(new java.util.HashSet<>(java.util.Arrays.asList(polytechnic, iti, deled).stream().filter(java.util.Objects::nonNull).toList()));
        counsellorRepository.save(c2);

        // Deactivate or delete any other records (e.g. 3rd counsellor)
        for (int i = 2; i < existing.size(); i++) {
            Counsellor extra = existing.get(i);
            extra.setActive(false);
            counsellorRepository.save(extra);
        }

        logger.info("Successfully synchronized 2 official admission advisors into MySQL.");
    }

    private void seedOrUpdateProgram(
            String code,
            String name,
            EducationPath educationPath,
            String shortDescription,
            String duration,
            String eligibility,
            String studyMode,
            String overview,
            String whatYouWillStudy,
            String whyChoose,
            String admissionProcess,
            Integer displayOrder
    ) {
        Program program = programRepository.findByCode(code)
                .orElse(Program.builder().code(code).build());

        program.setName(name);
        program.setEducationPath(educationPath);
        program.setShortDescription(shortDescription);
        program.setDuration(duration);
        program.setEligibility(eligibility);
        program.setStudyMode(studyMode);
        program.setOverview(overview);
        program.setWhatYouWillStudy(whatYouWillStudy);
        program.setWhyChoose(whyChoose);
        program.setAdmissionProcess(admissionProcess);
        program.setDisplayOrder(displayOrder);
        program.setActive(true);

        programRepository.save(program);
    }
}
