-- ============================================================
-- SCHOOL EVENTS DATA SEED
-- Migration: 20251215100000_seed_school_events.sql
-- Generated: 2025-12-15T03:45:29.027Z
-- Total events: 100
-- ============================================================

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3789_1', 3789, 'Samford U',
  'Samford U Nurse Anesthesia Virtual Q&A Information Session', 'Join professors for a virtual Q&A Information Session to learn more about the Nurse Anesthesia graduate program. The session will include an overview of the program and a time to have your questions answered.',
  '2025-10-06',
  '4:30 PM - 6:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3789_2', 3789, 'Samford U',
  'Nurse Anesthesia Virtual Q&A Information Session', 'Join professors for a virtual Q&A Information Session to learn more about the Nurse Anesthesia graduate program. The session will include an overview of the program and a time to have your questions answered.',
  '2025-11-18',
  '4:30 PM - 6:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3790_1', 3790, 'U of Alabama at Birmingham',
  'UAB Nurse Anesthesia Open House', 'To help you get a better understanding about the UAB School of Nursing and our DNP Nurse Anesthesia Pathway, we invite you to join us March 4, 2025 from 3:00 - 4:00 PM for our upcoming Virtual Open House where you will have the opportunity to interact and ask questions with our faculty and staff.',
  '2025-03-04',
  '3:00 PM - 4:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3793_1', 3793, 'U of Arizona',
  'U of Arizona DNP Virtual Information Session', 'This virtual event will provide an opportunity to learn more about the DNP program, including the various specialties offered, admission requirements, and the application process.',
  '2025-08-20',
  '2:00 PM - 3:00 PM', 'MST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3797_1', 3797, 'Loma Linda U',
  'LLU CRNA DNP Virtual Information Session', 'Loma Linda University School of Nursing is pleased to present this wonderful opportunity to connect. Join us to learn more about our Certified Registered Nurse Anesthetists (CRNA) program. You will hear from program representatives about requirements and admissions. You will also have an opportunity to ask questions.',
  '2024-11-14',
  '12:00 PM - 1:00 PM', 'PDT',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3799_1', 3799, 'Samuel Merritt U',
  'Financial Aid Overview Webinar - Graduate Nursing (All ELMSN, MSN, and DNP programs)', 'Learn more about the financial aid process for the Entry Level Master of Science in Nursing (ELMSN) and all other graduate nursing programs (MSN-FNP, MSN-CM, MSN-CLE, DNP, DNP-FNP,  PMHNP, FNP Certificate, PMHNP Certificate, and CRNA). Overview will include financial aid options, loans, scholarships, work study. Q&A related to financial aid will also be available.',
  '2025-09-17',
  '12:00 PM - 1:00 PM', 'PDT',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3801_1', 3801, 'Fairfield U Nurse Anesthesia Program',
  'DNP Nurse Anesthesia Virtual Information Session', 'Learn more about the Egan School of Nursing and Health Studies DNP Nurse Anesthesia Program from our program director and admission staff. Admission deadlines, application requirements, and program curriculum will be presented in the overview. A Q&A session will follow the presentation.',
  '2025-08-25',
  '6:00 PM - 7:00PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3804_1', 3804, 'AdventHealth U',
  'AHU University Fall Open House', 'At AdventHealth University, you’ll make connections with people who’ll teach you skills to last a lifetime. You’ll make memories and friends and start a health care career you can be passionate about. Begin with a single step.',
  '2024-10-23',
  '5:00 PM - 8:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3805_1', 3805, 'Barry U',
  'Barry U Virtual Nurse Anesthesia INFO SESSION (BSN-DNP); Barry U Virtual Nurse Anesthesia INFO SESSION (BSN-DNP)', 'Gain invaluable guidance and support from our admissions experts who will provide professional assistance in navigating the admissions process while addressing all your program-related questions during our informative educational info session.; Gain invaluable guidance and support from our admissions experts who will provide professional assistance in navigating the admissions process while addressing all your program-related questions during our informative educational info session.',
  '2024-10-21',
  '10:30 AM - 11:30 AM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3805_2', 3805, 'Barry U',
  'Barry U Virtual Nurse Anesthesia INFO SESSION (BSN-DNP); Barry U Virtual Nurse Anesthesia INFO SESSION (BSN-DNP)', 'Gain invaluable guidance and support from our admissions experts who will provide professional assistance in navigating the admissions process while addressing all your program-related questions during our informative educational info session.; Gain invaluable guidance and support from our admissions experts who will provide professional assistance in navigating the admissions process while addressing all your program-related questions during our informative educational info session.',
  '2024-11-13',
  '10:30 AM - 11:30 AM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3812_1', 3812, 'U of South Florida',
  'USF College of Nursing Upper Division Info Session', 'This live information session will cover details about the Upper Division nursing pathway and what to expect if you are selected for admission. Some of the topics include:  

Time Management
School/Life Balance
Clinicals
Simulation Experiences
Cost',
  '2025-09-09',
  '12:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3812_2', 3812, 'U of South Florida',
  'USF College of Nursing Upper Division Info Session;', 'This live information session will cover details about the Upper Division nursing pathway and what to expect if you are selected for admission. Some of the topics include:  

Time Management
School/Life Balance
Clinicals
Simulation Experiences
Cost',
  '2025-10-29',
  '12:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3812_3', 3812, 'U of South Florida',
  'USF College of Nursing Upper Division Info Session', 'This live information session will cover details about the Upper Division nursing pathway and what to expect if you are selected for admission. Some of the topics include:  

Time Management
School/Life Balance
Clinicals
Simulation Experiences
Cost',
  '2025-11-21',
  '12:00PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3815_1', 3815, 'Decatur & Millikin',
  'Decatur & Millikin In-person Nurse Anesthetist Info Session', 'Discover the rewarding career of nurse anesthesia at our Nurse Anesthetist Info Session! In this session, you’ll learn more about the program, hear from current students, join a question-and-answer session, and have time to visit with Millikin and Decatur Memorial Hospital Staff.',
  '2024-10-10',
  '3:00 PM - 5:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3816_1', 3816, 'NorthShore U',
  'NorthShore School of Nurse Anesthesia Open House', 'Evanston Hospital Frank Auditorium, 2650 Ridge Ave, Evanston, IL, 60201',
  '2025-03-01',
  '9:00 AM - 12:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3817_1', 3817, 'Rosalind Franklin',
  'RFU Nurse Anesthesiology Open House', 'Meet in a virtual setting with an admissions counselor and the program director.  During these sessions, we provide a programmatic overview as well as share general information about Rosalind Franklin University.',
  '2025-09-27',
  '10:00 AM - 2:00 PM', NULL,
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3818_1', 3818, 'Rush U',
  'Rush U Information Sessions', 'We host on-campus and online information sessions where you can learn more about specific programs. Click through to find an upcoming session in your program of interest.',
  NULL,
  'TBA', NULL,
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_2527829_1', 2527829, 'University of Illinois Chicago',
  'DNP Nurse Anesthesia Program: Student and Faculty Q&A Panel', 'Virtual Q&A panel for students interested in UIC Nursing’s DNP Nurse Anesthesia program. Bring all your questions about the enrollment process, financial aid, scholarships, life in the program, etc. Whatever your questions are, we welcome them and you!

And as a bonus, you’ll also get to connect with DNP Nurse Anesthesia program director Susan M. Krawczyk, DNP, CRNA, as well as some current students and a few of your future classmates.',
  '2025-10-16',
  '6:00 PM - 7:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3819_1', 3819, 'S. Illinois U',
  'UIC Nursing Graduate and Professional Open House', 'Discover your path in nursing with Illinois'' leading graduate and professional programs! Meet our expert faculty, tour our state-of-the-art facilities, and get all your questions answered. Whether you''re new to nursing or advancing your career, UIC has a path for you.',
  '2024-11-14',
  '4:00 PM - 6:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3821_1', 3821, 'U of Evansville Nurse Anesthesia Program',
  'UE Nurse Anesthesia Program Open House', 'Email Missy Holzmeyer at ms6@evansville.edu for more information and to RSVP.',
  '2024-10-28',
  'TBA', NULL,
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3825_1', 3825, 'Baptist Health Murray State U Program of Anesthesia',
  'Zoom Open House', 'learn more about the DNP - Nurse Anesthesia Program',
  '2025-08-28',
  '3:30 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3828_1', 3828, 'Louisiana State U',
  'LSU BSN to DNP: Nurse Anesthesia Information Session', 'Please join us at one of our informational sessions. Our goal is to provide you with insights within our respected programs. We hope you will give us the opportunity for you to know us beyond the website.',
  NULL,
  'TBA', NULL,
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3830_1', 3830, 'U of New England School of Nurse Anesthesia',
  'Portland Graduate Open House', 'Join us on UNE’s Portland Campus for the Health Sciences for a day designed to inspire your next step. Whether you’re just starting to explore graduate programs, narrowing down your options, or already in the application process, this event offers a firsthand look at what makes UNE unique.',
  '2025-09-27',
  '9:00 AM - 2:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3830_2', 3830, 'U of New England School of Nurse Anesthesia',
  'Portland Graduate Open House', 'Join us on UNE’s Portland Campus for the Health Sciences for a day designed to inspire your next step. Whether you’re just starting to explore graduate programs, narrowing down your options, or already in the application process, this event offers a firsthand look at what makes UNE unique.',
  '2025-11-01',
  '9:00 AM - 2:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3833_1', 3833, 'U of Maryland School of Nursing Graduate Programs Nurse Anesthesia',
  'U of Maryland Doctor of Nursing Practice Online Chat', 'Learn more about the University of Maryland School of Nursing’s Doctor of Nursing Practice (DNP) program, which prepares elite nursing professionals to lead in today''s increasingly complex health care system.',
  '2025-09-16',
  '4:00 PM - 5:00 PM', NULL,
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3833_2', 3833, 'U of Maryland School of Nursing Graduate Programs Nurse Anesthesia',
  'U of Maryland Doctor of Nursing Practice Online Chat', 'Learn more about the University of Maryland School of Nursing’s Doctor of Nursing Practice (DNP) program, which prepares elite nursing professionals to lead in today''s increasingly complex health care system.',
  '2025-11-04',
  '2:00 PM - 3:00 PM', NULL,
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3834_1', 3834, 'Boston College William F. Connell School of Nursing Nurse Anesthesia Program',
  'BC Graduate Student In-person Campus Tour; BC Graduate Student Virtual Campus Tour', 'Our in-person campus tours are individualized—each tour is limited to just one prospective student and one guest. Each tour lasts approximately 1 hour and is led by a current graduate student. This tour is a great introduction to Boston College and gives you a chance to see and experience campus and begin asking questions.; Our virtual tours are live—you''ll join a Zoom chatroom with a current graduate student hosting the tour just for you!  Each tour lasts approximately 30 minutes. This tour includes a video preview of campus and allows you the opportunity to connect with a current student and begin asking questions.',
  NULL,
  'Please visit the link for available time', NULL,
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3834_2', 3834, 'Boston College William F. Connell School of Nursing Nurse Anesthesia Program',
  'BC Graduate Student In-person Campus Tour; BC Graduate Student Virtual Campus Tour', 'Our in-person campus tours are individualized—each tour is limited to just one prospective student and one guest. Each tour lasts approximately 1 hour and is led by a current graduate student. This tour is a great introduction to Boston College and gives you a chance to see and experience campus and begin asking questions.; Our virtual tours are live—you''ll join a Zoom chatroom with a current graduate student hosting the tour just for you!  Each tour lasts approximately 30 minutes. This tour includes a video preview of campus and allows you the opportunity to connect with a current student and begin asking questions.',
  NULL,
  'Please visit the link for available time', NULL,
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3836_1', 3836, 'Michigan State U Nurse Anesthesia Program',
  'MSU Graduate Program Virtual Information Day; MSU Nurse Anesthesiology Webinar', 'Learn more about the College of Nursing’s graduate programs at this virtual information fair! Hear from faculty and current students in the Clinical Nurse Specialist, Nurse Practitioner, Nurse Anesthesiology, and PhD programs.; Learn more about the Nurse Anesthesiology DNP program at Michigan State University!',
  '2024-11-26',
  '6:00 PM - 7:30 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3836_2', 3836, 'Michigan State U Nurse Anesthesia Program',
  'MSU Graduate Program Virtual Information Day; MSU Nurse Anesthesiology Webinar', 'Learn more about the College of Nursing’s graduate programs at this virtual information fair! Hear from faculty and current students in the Clinical Nurse Specialist, Nurse Practitioner, Nurse Anesthesiology, and PhD programs.; Learn more about the Nurse Anesthesiology DNP program at Michigan State University!',
  '2024-12-03',
  '4:00 PM - 5:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3837_1', 3837, 'Oakland U Beaumont Graduate Program of Nurse Anesthesia',
  'Oakland U Beaumont Nurse Anesthesia Information Session', 'The Oakland University-Beaumont Graduate Program of Nurse Anesthesia is a collaborative initiative between Oakland University and nationally renowned Beaumont Health System. Working in concert, both institutions are able to provide an exceptional educational environment for educating Certified Registered Nurse Anesthetists.',
  '2024-11-07',
  '4:00 PM - 6:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3838_1', 3838, 'U of Detroit Mercy Graduate Program of Nurse Anesthesia',
  'Detroit Mercy Nurse Anesthesia: Information Session', 'Information Sessions are held generally the third Monday of every other month (except November and December). Faculty & students will take your questions;
The Detroit Mercy Nurse Anesthesia program conducts this annual event to showcase our program and students, embrace our CRNA community, connect with alumni and introduce interested RNs to anesthesia topics. We have a full and exciting day of presentations, including a required lecture for RN license renewal on Human Sex Trafficking in accordance with the Michigan Attorney General and the Department of LARA''s regulation for RN licensure renewal. The information is beneficial to all practitioners in attendance. This year, we will also have a professional photographer from Shupictures available to take headshots for anyone interested (fee of $40).',
  '2025-10-20',
  '4:30:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3838_2', 3838, 'U of Detroit Mercy Graduate Program of Nurse Anesthesia',
  'Detroit Mercy Nurse Anesthesia Seminar', 'Information Sessions are held generally the third Monday of every other month (except November and December). Faculty & students will take your questions;
The Detroit Mercy Nurse Anesthesia program conducts this annual event to showcase our program and students, embrace our CRNA community, connect with alumni and introduce interested RNs to anesthesia topics. We have a full and exciting day of presentations, including a required lecture for RN license renewal on Human Sex Trafficking in accordance with the Michigan Attorney General and the Department of LARA''s regulation for RN licensure renewal. The information is beneficial to all practitioners in attendance. This year, we will also have a professional photographer from Shupictures available to take headshots for anyone interested (fee of $40).',
  '2025-11-15',
  '8:00 AM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3839_1', 3839, 'U of Michigan-Flint Nurse Anesthesia Program',
  'UM Flint Anesthesia (DNAP) Webinar', 'Hear from DNAP faculty and staff about the curriculum, admission requirements and the application process. You''ll also have a chance to get your questions answered.',
  '2024-12-05',
  '1:00 PM - 2:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3840_1', 3840, 'Wayne State U Eugene Applebaum College of Pharmacy and Health Sciences',
  'Wayne State Nurse Anesthesia Informational Meeting; Wayne State Nurse Anesthesia Informational Meeting; Wayne State Nurse Anesthesia Informational Meeting', 'You''ll hear a little bit of the history of the program, as well as what currently makes our program unique. Get a feel for what the incoming class application statistics looks like, as well as have an opportunity to connect with current students.; You''ll hear a little bit of the history of the program, as well as what currently makes our program unique. Get a feel for what the incoming class application statistics looks like, as well as have an opportunity to connect with current students.; You''ll hear a little bit of the history of the program, as well as what currently makes our program unique. Get a feel for what the incoming class application statistics looks like, as well as have an opportunity to connect with current students.',
  '2025-10-08',
  '4:00:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3840_2', 3840, 'Wayne State U Eugene Applebaum College of Pharmacy and Health Sciences',
  'Wayne State Nurse Anesthesia Informational Meeting; Wayne State Nurse Anesthesia Informational Meeting; Wayne State Nurse Anesthesia Informational Meeting', 'You''ll hear a little bit of the history of the program, as well as what currently makes our program unique. Get a feel for what the incoming class application statistics looks like, as well as have an opportunity to connect with current students.; You''ll hear a little bit of the history of the program, as well as what currently makes our program unique. Get a feel for what the incoming class application statistics looks like, as well as have an opportunity to connect with current students.; You''ll hear a little bit of the history of the program, as well as what currently makes our program unique. Get a feel for what the incoming class application statistics looks like, as well as have an opportunity to connect with current students.',
  '2025-11-12',
  '5:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3840_3', 3840, 'Wayne State U Eugene Applebaum College of Pharmacy and Health Sciences',
  'Wayne State Nurse Anesthesia Informational Meeting; Wayne State Nurse Anesthesia Informational Meeting; Wayne State Nurse Anesthesia Informational Meeting', 'You''ll hear a little bit of the history of the program, as well as what currently makes our program unique. Get a feel for what the incoming class application statistics looks like, as well as have an opportunity to connect with current students.; You''ll hear a little bit of the history of the program, as well as what currently makes our program unique. Get a feel for what the incoming class application statistics looks like, as well as have an opportunity to connect with current students.; You''ll hear a little bit of the history of the program, as well as what currently makes our program unique. Get a feel for what the incoming class application statistics looks like, as well as have an opportunity to connect with current students.',
  '2025-12-10',
  '5:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3841_1', 3841, 'Mayo Clinic School of Health Sciences Doctor of Nurse Anesthesia Practice Program',
  'Mayo Clinic NAP Information Session; Mayo Clinic NAP Information Session', 'Mayo Clinic School of Health Sciences Doctorate of Nurse Anesthesia will be holding an information session for those interested in learning more about the program. Program Director, Dr. Martin will go over admissions, program structure, and answer questions from participants.; Mayo Clinic School of Health Sciences Doctorate of Nurse Anesthesia will be holding an information session for those interested in learning more about the program. Program Director, Dr. Martin will go over admissions, program structure, and answer questions from participants.',
  '2024-11-07',
  '10:00 AM - 11:00 AM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3841_2', 3841, 'Mayo Clinic School of Health Sciences Doctor of Nurse Anesthesia Practice Program',
  'Mayo Clinic NAP Information Session; Mayo Clinic NAP Information Session', 'Mayo Clinic School of Health Sciences Doctorate of Nurse Anesthesia will be holding an information session for those interested in learning more about the program. Program Director, Dr. Martin will go over admissions, program structure, and answer questions from participants.; Mayo Clinic School of Health Sciences Doctorate of Nurse Anesthesia will be holding an information session for those interested in learning more about the program. Program Director, Dr. Martin will go over admissions, program structure, and answer questions from participants.',
  '2024-12-05',
  '10:00 AM - 11:00 AM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3842_1', 3842, 'Minneapolis School of Anesthesia',
  'MSA Graduate Programs In-person Open House', 'Speak with faculty and advisors from programs that interest you, take a tour of campus, and get the answers you need to find, fund, and select the right graduate program for you.',
  '2024-11-19',
  '5:00 PM - 7:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3844_1', 3844, 'U of Minnesota School of Nursing Nurse Anesthesia Area of Study',
  'U of Minnesota Doctor of Nursing Practice Information Session', 'During the session, we will go over the Doctor of Nursing Practice program at the University of Minnesota School of Nursing, the application process, admissions timeline, and curriculum. You will also have the opportunity to have your questions answered by someone on the admissions team.; During the session, we will go over the Doctor of Nursing Practice program at the University of Minnesota School of Nursing, the application process, admissions timeline, and curriculum. You will also have the opportunity to have your questions answered by someone on the admissions team.; During the session, we will go over the Doctor of Nursing Practice program at the University of Minnesota School of Nursing, the application process, admissions timeline, and curriculum. You will also have the opportunity to have your questions answered by someone on the admissions team.',
  '2025-09-10',
  '3:00 PM - 4:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3844_2', 3844, 'U of Minnesota School of Nursing Nurse Anesthesia Area of Study',
  'U of Minnesota Doctor of Nursing Practice Information Session', 'During the session, we will go over the Doctor of Nursing Practice program at the University of Minnesota School of Nursing, the application process, admissions timeline, and curriculum. You will also have the opportunity to have your questions answered by someone on the admissions team.; During the session, we will go over the Doctor of Nursing Practice program at the University of Minnesota School of Nursing, the application process, admissions timeline, and curriculum. You will also have the opportunity to have your questions answered by someone on the admissions team.; During the session, we will go over the Doctor of Nursing Practice program at the University of Minnesota School of Nursing, the application process, admissions timeline, and curriculum. You will also have the opportunity to have your questions answered by someone on the admissions team.',
  '2025-10-09',
  '8:30 PM - 9:30 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3844_3', 3844, 'U of Minnesota School of Nursing Nurse Anesthesia Area of Study',
  'U of Minnesota Doctor of Nursing Practice Information Session', 'During the session, we will go over the Doctor of Nursing Practice program at the University of Minnesota School of Nursing, the application process, admissions timeline, and curriculum. You will also have the opportunity to have your questions answered by someone on the admissions team.; During the session, we will go over the Doctor of Nursing Practice program at the University of Minnesota School of Nursing, the application process, admissions timeline, and curriculum. You will also have the opportunity to have your questions answered by someone on the admissions team.; During the session, we will go over the Doctor of Nursing Practice program at the University of Minnesota School of Nursing, the application process, admissions timeline, and curriculum. You will also have the opportunity to have your questions answered by someone on the admissions team.',
  '2025-10-22',
  '3:00 PM - 4:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3845_1', 3845, 'U of Southern Mississippi Nurse Anesthesia Program',
  'USM NAP Face-to-face and Virtual Information Session; USM NAP Face-to-face and Virtual Information Session', 'These sessions provide an opportunity to learn about the program, tour the facilities, and ask questions about the application process. Registration is required. Duplicate information will be provided at each session. A meeting link will be sent for virtual attendees before the meeting time. Information sessions are informal events, and casual dress is acceptable.; These sessions provide an opportunity to learn about the program, tour the facilities, and ask questions about the application process. Registration is required. Duplicate information will be provided at each session. A meeting link will be sent for virtual attendees before the meeting time. Information sessions are informal events, and casual dress is acceptable.',
  '2025-11-10',
  '6:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3845_2', 3845, 'U of Southern Mississippi Nurse Anesthesia Program',
  'USM NAP Face-to-face and Virtual Information Session; USM NAP Face-to-face and Virtual Information Session', 'These sessions provide an opportunity to learn about the program, tour the facilities, and ask questions about the application process. Registration is required. Duplicate information will be provided at each session. A meeting link will be sent for virtual attendees before the meeting time. Information sessions are informal events, and casual dress is acceptable.; These sessions provide an opportunity to learn about the program, tour the facilities, and ask questions about the application process. Registration is required. Duplicate information will be provided at each session. A meeting link will be sent for virtual attendees before the meeting time. Information sessions are informal events, and casual dress is acceptable.',
  '2026-03-02',
  '6:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3855_1', 3855, 'Hofstra U',
  'Hofstra Graduate Nursing Information Session; Hofstra Graduate Nursing Information Session; Hofstra U Virtual Graduate Open House', 'At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!',
  '2025-09-18',
  '12:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3855_2', 3855, 'Hofstra U',
  'Hofstra Graduate Nursing Information Session; Hofstra Graduate Nursing Information Session; Hofstra U Virtual Graduate Open House', 'At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!',
  '2025-10-16',
  '12:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3855_3', 3855, 'Hofstra U',
  'Hofstra Graduate Nursing Information Session; Hofstra Graduate Nursing Information Session; Hofstra U Virtual Graduate Open House', 'At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!; At this event, you will have the opportunity to chat with Hofstra faculty, learn about services offered by Residential Programs, Student Financial Services, and the Center for Career Design and Development. You can also virtually tour our beautiful 244-acre campus!',
  '2025-11-16',
  '11:00 AM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3856_1', 3856, 'SUNY Buffalo',
  'UB Nursing Graduate Virtual Information Session; UB Nursing Graduate Virtual Information Session; UB Nursing Graduate Virtual', 'Join us for a virtual information session to learn about our DNP, PhD, and Advanced Certificate Programs. The session will provide a program overview, admissions requirements, applications deadlines, the application process and will address other questions you may have.; Join us for a virtual information session to learn about our DNP, PhD, and Advanced Certificate Programs. The session will provide a program overview, admissions requirements, applications deadlines, the application process and will address other questions you may have.; Join us for a virtual information session to learn about our DNP, PhD, and Advanced Certificate Programs. The session will provide a program overview, admissions requirements, applications deadlines, the application process and will address other questions you may have.; Join us for a virtual information session to learn about our DNP, PhD, and Advanced Certificate Programs. The session will provide a program overview, admissions requirements, applications deadlines, the application process and will address other questions you may have.',
  '2025-09-15',
  '1:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3856_2', 3856, 'SUNY Buffalo',
  'UB Nursing Graduate Virtual Information Session; UB Nursing Graduate Virtual Information Session; UB Nursing Graduate Virtual', 'Join us for a virtual information session to learn about our DNP, PhD, and Advanced Certificate Programs. The session will provide a program overview, admissions requirements, applications deadlines, the application process and will address other questions you may have.; Join us for a virtual information session to learn about our DNP, PhD, and Advanced Certificate Programs. The session will provide a program overview, admissions requirements, applications deadlines, the application process and will address other questions you may have.; Join us for a virtual information session to learn about our DNP, PhD, and Advanced Certificate Programs. The session will provide a program overview, admissions requirements, applications deadlines, the application process and will address other questions you may have.; Join us for a virtual information session to learn about our DNP, PhD, and Advanced Certificate Programs. The session will provide a program overview, admissions requirements, applications deadlines, the application process and will address other questions you may have.',
  '2025-09-23',
  '2:30 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3856_3', 3856, 'SUNY Buffalo',
  'UB Nursing Graduate Virtual Information Session; UB Nursing Graduate Virtual Information Session; UB Nursing Graduate Virtual', 'Join us for a virtual information session to learn about our DNP, PhD, and Advanced Certificate Programs. The session will provide a program overview, admissions requirements, applications deadlines, the application process and will address other questions you may have.; Join us for a virtual information session to learn about our DNP, PhD, and Advanced Certificate Programs. The session will provide a program overview, admissions requirements, applications deadlines, the application process and will address other questions you may have.; Join us for a virtual information session to learn about our DNP, PhD, and Advanced Certificate Programs. The session will provide a program overview, admissions requirements, applications deadlines, the application process and will address other questions you may have.; Join us for a virtual information session to learn about our DNP, PhD, and Advanced Certificate Programs. The session will provide a program overview, admissions requirements, applications deadlines, the application process and will address other questions you may have.',
  '2025-10-08',
  '11:00 AM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3862_1', 3862, 'Western Carolina U Nurse Anesthesia Program',
  'WCU Virtual Graduate School Open House', 'At this virtual information session, you will have the opportunity to learn more about Western Carolina University, gain greater understanding of the Graduate School application process, and interact with other prospective students, key staff, and program directors for our residential (in-person) programs. This will also be your chance to ask any questions about the program that you are interested in - to both our panel of graduate ambassadors (current students) and program faculty in breakout rooms.',
  '2025-09-23',
  '5:00 PM - 6:30 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3865_1', 3865, 'Frances Payne Bolton School of Nursing Program of Nurse Anesthesia Case Western Reserve U',
  'Case DNP Nurse Anesthesia Online Information Session', 'Join this live application overview session for the DNP Nurse Anesthesia Program. The Program Director Dr. Sonya Moore and the Recruitment and Enrollment Office will be providing a walk through of the application requirements and tips to make your application competitive. Please bring any questions with you for the live Q&A session at the conclusion of the presentation.',
  '2024-11-14',
  '12:00 PM - 1:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3867_1', 3867, 'The U of Akron Nurse Anesthesia Program',
  'U of Akron SON Graduate Programs Virtual Information Session; U of Akron Nurse Anesthesia DNP Virtual Information Session; U of Akron SON Graduate Programs Virtual Information Session', 'This session is designed for registered nurses interested in advancing their education and career. You''ll learn about the program’s curriculum, varying nurse practitioner degree tracks, admission requirements, and the many benefits of continuing your nursing education journey. Our faculty will be available to answer questions and provide insights into how this degree can enhance your nursing practice.; This session is designed for bachelor’s prepared nurses interested in becoming Registered Nurse Anesthetists (CRNAs). Successful completion of this program leads to the Doctor of Nursing Practice Degree. You''ll learn about the program’s curriculum and admission requirements. Our faculty will be available to answer your questions and provide insights into this unique degree.; This session is designed for registered nurses interested in advancing their education and career. You''ll learn about the program’s curriculum, varying nurse practitioner degree tracks, admission requirements, and the many benefits of continuing your nursing education journey. Our faculty will be available to answer questions and provide insights into how this degree can enhance your nursing practice.',
  '2024-10-22',
  '8:00 PM - 9:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3867_2', 3867, 'The U of Akron Nurse Anesthesia Program',
  'U of Akron SON Graduate Programs Virtual Information Session; U of Akron Nurse Anesthesia DNP Virtual Information Session; U of Akron SON Graduate Programs Virtual Information Session', 'This session is designed for registered nurses interested in advancing their education and career. You''ll learn about the program’s curriculum, varying nurse practitioner degree tracks, admission requirements, and the many benefits of continuing your nursing education journey. Our faculty will be available to answer questions and provide insights into how this degree can enhance your nursing practice.; This session is designed for bachelor’s prepared nurses interested in becoming Registered Nurse Anesthetists (CRNAs). Successful completion of this program leads to the Doctor of Nursing Practice Degree. You''ll learn about the program’s curriculum and admission requirements. Our faculty will be available to answer your questions and provide insights into this unique degree.; This session is designed for registered nurses interested in advancing their education and career. You''ll learn about the program’s curriculum, varying nurse practitioner degree tracks, admission requirements, and the many benefits of continuing your nursing education journey. Our faculty will be available to answer questions and provide insights into how this degree can enhance your nursing practice.',
  '2024-11-05',
  '1:00 PM- 2:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3867_3', 3867, 'The U of Akron Nurse Anesthesia Program',
  'U of Akron SON Graduate Programs Virtual Information Session; U of Akron Nurse Anesthesia DNP Virtual Information Session; U of Akron SON Graduate Programs Virtual Information Session', 'This session is designed for registered nurses interested in advancing their education and career. You''ll learn about the program’s curriculum, varying nurse practitioner degree tracks, admission requirements, and the many benefits of continuing your nursing education journey. Our faculty will be available to answer questions and provide insights into how this degree can enhance your nursing practice.; This session is designed for bachelor’s prepared nurses interested in becoming Registered Nurse Anesthetists (CRNAs). Successful completion of this program leads to the Doctor of Nursing Practice Degree. You''ll learn about the program’s curriculum and admission requirements. Our faculty will be available to answer your questions and provide insights into this unique degree.; This session is designed for registered nurses interested in advancing their education and career. You''ll learn about the program’s curriculum, varying nurse practitioner degree tracks, admission requirements, and the many benefits of continuing your nursing education journey. Our faculty will be available to answer questions and provide insights into how this degree can enhance your nursing practice.',
  '2024-11-26',
  '8:00 PM - 9:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3871_1', 3871, 'Cedar Crest College Nurse Anesthesia Program',
  'Cedar Crest Fall Open Housez', 'Meet inspiring professors, connect with current students, and chat one-on-one with the Admissions team. Whether you’re narrowing down your college list or just getting started, this is your moment to explore what makes Cedar Crest feel like home.',
  '2025-09-20',
  '10:00 AM - 12:30 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3877_1', 3877, 'Thomas Jefferson U Jefferson College of Nursing Nurse Anesthesia Program',
  'Thomas Jefferson U DNP NA Virtual Information Session', 'Join our Admissions team and faculty to learn more about Doctor of Nursing Practice Nurse Anesthesia program.',
  '2024-11-06',
  '12:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3878_1', 3878, 'U of Pennsylvania School of Nursing Nurse Anesthesia Program',
  'UPenn DNP Programs Virtual Information Session; UPenn Nursing & Healthcare Leadership Info Session;  UPenn DNP Programs Virtual Info Session; UPenn DNP Programs Virtual Info Session; Fall 2025 Graduate Open House; UPenn DNP Programs Virtual Info Session', 'Penn Nursing’s DNP prepares nurses to take their careers to the next level. Graduates build on their education and experience to become innovative health care leaders at the top of their fields, improving health around the world through policy, practice, and research.

Consistently top-ranked, this innovative leadership program is now being offered online. It prepares graduates for a variety of leadership roles throughout the healthcare industry. Join us to learn more!

Join us for this in-person event to learn more about our 10 MSN programs, Master’s of Science in Nutrition Science (MSNS), Master of Professional Nursing (MPN) an accelerated nursing program for future nursing students with a non-nursing bachelor’s degree in another discipline, and DNP programs!',
  '2025-09-08',
  '7:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3878_2', 3878, 'U of Pennsylvania School of Nursing Nurse Anesthesia Program',
  'UPenn DNP Programs Virtual Information Session; UPenn Nursing & Healthcare Leadership Info Session;  UPenn DNP Programs Virtual Info Session; UPenn DNP Programs Virtual Info Session; Fall 2025 Graduate Open House; UPenn DNP Programs Virtual Info Session', 'Penn Nursing’s DNP prepares nurses to take their careers to the next level. Graduates build on their education and experience to become innovative health care leaders at the top of their fields, improving health around the world through policy, practice, and research.

Consistently top-ranked, this innovative leadership program is now being offered online. It prepares graduates for a variety of leadership roles throughout the healthcare industry. Join us to learn more!

Join us for this in-person event to learn more about our 10 MSN programs, Master’s of Science in Nutrition Science (MSNS), Master of Professional Nursing (MPN) an accelerated nursing program for future nursing students with a non-nursing bachelor’s degree in another discipline, and DNP programs!',
  '2025-09-18',
  '12:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3878_3', 3878, 'U of Pennsylvania School of Nursing Nurse Anesthesia Program',
  'UPenn DNP Programs Virtual Information Session; UPenn Nursing & Healthcare Leadership Info Session;  UPenn DNP Programs Virtual Info Session; UPenn DNP Programs Virtual Info Session; Fall 2025 Graduate Open House; UPenn DNP Programs Virtual Info Session', 'Penn Nursing’s DNP prepares nurses to take their careers to the next level. Graduates build on their education and experience to become innovative health care leaders at the top of their fields, improving health around the world through policy, practice, and research.

Consistently top-ranked, this innovative leadership program is now being offered online. It prepares graduates for a variety of leadership roles throughout the healthcare industry. Join us to learn more!

Join us for this in-person event to learn more about our 10 MSN programs, Master’s of Science in Nutrition Science (MSNS), Master of Professional Nursing (MPN) an accelerated nursing program for future nursing students with a non-nursing bachelor’s degree in another discipline, and DNP programs!',
  '2025-09-23',
  '12:00 - 1:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3878_4', 3878, 'U of Pennsylvania School of Nursing Nurse Anesthesia Program',
  'UPenn DNP Programs Virtual Information Session; UPenn Nursing & Healthcare Leadership Info Session;  UPenn DNP Programs Virtual Info Session; UPenn DNP Programs Virtual Info Session; Fall 2025 Graduate Open House; UPenn DNP Programs Virtual Info Session', 'Penn Nursing’s DNP prepares nurses to take their careers to the next level. Graduates build on their education and experience to become innovative health care leaders at the top of their fields, improving health around the world through policy, practice, and research.

Consistently top-ranked, this innovative leadership program is now being offered online. It prepares graduates for a variety of leadership roles throughout the healthcare industry. Join us to learn more!

Join us for this in-person event to learn more about our 10 MSN programs, Master’s of Science in Nutrition Science (MSNS), Master of Professional Nursing (MPN) an accelerated nursing program for future nursing students with a non-nursing bachelor’s degree in another discipline, and DNP programs!',
  '2025-10-09',
  '10:00 AM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3878_5', 3878, 'U of Pennsylvania School of Nursing Nurse Anesthesia Program',
  'UPenn DNP Programs Virtual Information Session; UPenn Nursing & Healthcare Leadership Info Session;  UPenn DNP Programs Virtual Info Session; UPenn DNP Programs Virtual Info Session; Fall 2025 Graduate Open House; UPenn DNP Programs Virtual Info Session', 'Penn Nursing’s DNP prepares nurses to take their careers to the next level. Graduates build on their education and experience to become innovative health care leaders at the top of their fields, improving health around the world through policy, practice, and research.

Consistently top-ranked, this innovative leadership program is now being offered online. It prepares graduates for a variety of leadership roles throughout the healthcare industry. Join us to learn more!

Join us for this in-person event to learn more about our 10 MSN programs, Master’s of Science in Nutrition Science (MSNS), Master of Professional Nursing (MPN) an accelerated nursing program for future nursing students with a non-nursing bachelor’s degree in another discipline, and DNP programs!',
  '2025-10-18',
  '9:00 AM - 3:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3879_1', 3879, 'U of Pittsburgh School of Nursing Nurse Anesthesia Program',
  'UPitt DNP Nurse Anesthesia Virtual Information Session', 'During the session, Nurse Anesthesia faculty and current nursing students will provide an overview of the program and the student experience.  Hang around for the Q&A and ask students about their classes, scholarly projects, and clinical experiences in Pitt''s CRNA Program.',
  '2024-10-07',
  '7:00 PM - 8:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3886_1', 3886, 'Medical U of South Carolina Anesthesia for Nurses Program',
  'MUSC On Campus DNAP Info Session; MUSC Virtual DNAP Infor Session', 'During the event, an Anesthesia for Nurses (AFN) faculty member will give an overview of the program, share admissions criteria, and provide information on how you can stand out as an applicant. You’ll receive a campus tour from a current AFN student and get the answers to all your burning questions during our Student Ambassador Q&A panel. ; During the session, program faculty will discuss the program''s curriculum, admissions requirements, the application process, and what sets MUSC apart from other universities. You will also have an opportunity to ask any questions you have.',
  '2024-10-26',
  '8:00 AM - 11:00 AM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3886_2', 3886, 'Medical U of South Carolina Anesthesia for Nurses Program',
  'MUSC On Campus DNAP Info Session; MUSC Virtual DNAP Infor Session', 'During the event, an Anesthesia for Nurses (AFN) faculty member will give an overview of the program, share admissions criteria, and provide information on how you can stand out as an applicant. You’ll receive a campus tour from a current AFN student and get the answers to all your burning questions during our Student Ambassador Q&A panel. ; During the session, program faculty will discuss the program''s curriculum, admissions requirements, the application process, and what sets MUSC apart from other universities. You will also have an opportunity to ask any questions you have.',
  '2024-10-28',
  '4:00 PM - 5:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3896_1', 3896, 'Baylor College of Medicine Doctor of Nursing Practice Program-Nurse Anesthesia',
  'Baylor College DNP Program-Nurse Anesthesia Information Sessions', 'This is an opportunity to learn about the program and ask questions about the application process.',
  '2025-10-06',
  '4:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3899_1', 3899, 'Virginia Commonwealth U Department of Nurse Anesthesia',
  'VCU Nurse Anesthesia Information Session', 'Join us for our free livestream information sessions, designed to give prospective students a clear overview of the VCU Nurse Anesthesia program. We’ll cover our four distance sites, integrated curriculum model, clinical rotations, and program structure, along with key insights into the admissions process.',
  '2025-09-11',
  '3:00 PM - 4:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3899_2', 3899, 'Virginia Commonwealth U Department of Nurse Anesthesia',
  'VCU Nurse Anesthesia Information Session', 'Join us for our free livestream information sessions, designed to give prospective students a clear overview of the VCU Nurse Anesthesia program. We’ll cover our four distance sites, integrated curriculum model, clinical rotations, and program structure, along with key insights into the admissions process.',
  '2025-10-30',
  '3:00 PM - 4:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3904_1', 3904, 'Marquette U College of Nursing Nurse Anesthesia Educational Program',
  'Nurse Anesthesia DNP Information Session', 'At this event, you will have the opportunity to hear from NAEP program faculty and staff, learn about the application process, and have your questions answered.We will also address what our review committee looks for in a strong application and how to set yourself apart in the interview process.

This session may be relevant for prospective students and previous applicants that wish to apply or reapply for the Fall 2026 cycle.',
  '2025-09-10',
  '5:00 PM - 6:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3906_1', 3906, 'UC Davis',
  'Doctor of Nursing Practice — Nurse Anesthesia Degree Program Info Session; Doctor of Nursing Practice (DNP) - Nurse Anesthesia Degree Program info session', 'This information session will provide an overview of the academics and admissions requirements of the DNP-NA program at the Betty Irene Moore School of Nursing at UC Davis.

This in-person session will provide an overview of the academic and admissions requirements for the program, Q&A and a program tour.',
  '2025-09-17',
  '5:30 PM - 6:30 PM', 'PDT',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3906_2', 3906, 'UC Davis',
  'Doctor of Nursing Practice — Nurse Anesthesia Degree Program Info Session; Doctor of Nursing Practice (DNP) - Nurse Anesthesia Degree Program info session', 'This information session will provide an overview of the academics and admissions requirements of the DNP-NA program at the Betty Irene Moore School of Nursing at UC Davis.

This in-person session will provide an overview of the academic and admissions requirements for the program, Q&A and a program tour.',
  '2025-10-15',
  '5:30 PM - 7:30 PM', 'PDT',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3817_1', 3817, 'Rosalind Franklin - Colorado Branch - SEE ILLINOIS LINK',
  'RFU Nurse Anesthesiology Open House; Doctor of Nursing Practice in Nurse Anesthesia Entry (DNP) RFU sessions', 'Come meet the RFU faculty, current students, and recent graduates of the program. Experience the classroom settings for in-person learning we share with UCCS, and obtain hands-on opportunities with our simulation equipment.

Discover Doctor of Nursing Practice in Nurse Anesthesia Entry (DNP) at RFU sessions provide prospective Rosalind Franklin University students an opportunity to meet in a virtual setting with an admissions counselor and the program director.  During these sessions, we provide a programmatic overview as well as share general information about Rosalind Franklin University.',
  '2025-09-27',
  '10:00 AM - 2:00 PM', 'MST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3817_2', 3817, 'Rosalind Franklin - Colorado Branch - SEE ILLINOIS LINK',
  'RFU Nurse Anesthesiology Open House; Doctor of Nursing Practice in Nurse Anesthesia Entry (DNP) RFU sessions', 'Come meet the RFU faculty, current students, and recent graduates of the program. Experience the classroom settings for in-person learning we share with UCCS, and obtain hands-on opportunities with our simulation equipment.

Discover Doctor of Nursing Practice in Nurse Anesthesia Entry (DNP) at RFU sessions provide prospective Rosalind Franklin University students an opportunity to meet in a virtual setting with an admissions counselor and the program director.  During these sessions, we provide a programmatic overview as well as share general information about Rosalind Franklin University.',
  '2025-09-11',
  '2:00 PM', 'MST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3910_1', 3910, 'Bellarmine University',
  'Bellarmine U DNP Nurse Anesthesia Information Session', 'All Information Sessions are either in-person at the Bellarmine Juneja Nurse Anesthesia Flynn Building, or via a Teams Meeting Link.',
  '2025-09-24',
  '4:00 PM - 6:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3911_1', 3911, 'Loyola University of New Orleans /Nurse Anesthesia and Adult-Gerontology Acute Care Nurse Practitioner',
  'Loyola U Virtual Open House;  Loyola U In-Person Open House', NULL,
  '2025-10-01',
  '8:00 PM - 9:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3911_2', 3911, 'Loyola University of New Orleans /Nurse Anesthesia and Adult-Gerontology Acute Care Nurse Practitioner',
  'Loyola U Virtual Open House;  Loyola U In-Person Open House', NULL,
  '2025-11-05',
  '7:30 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3914_1', 3914, 'Hunter-Bellevue School of Nursing (HBSON)',
  'Hunter-Bellevue AGACNP DNP In-person Information Session', 'This information session will address questions about the full-time program, admissions requirements, and what to expect as a CRNA AGACNP (DNP) student at the Hunter-Bellevue School of Nursing.;',
  '2024-10-16',
  '7:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3915_1', 3915, 'St. John Fisher University Wegmans',
  'CRNA Information Session; CRNA Virtual Information Session; CRNA Virtual Information Session', 'Join us for an Information Session to learn about Fisher’s CRNA program and to have your questions answered. See success at Fisher!',
  '2025-09-15',
  '4:00 PM - 5:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3915_2', 3915, 'St. John Fisher University Wegmans',
  'CRNA Information Session; CRNA Virtual Information Session; CRNA Virtual Information Session', 'Join us for an Information Session to learn about Fisher’s CRNA program and to have your questions answered. See success at Fisher!',
  '2025-10-15',
  '12:00 PM - 1:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3915_3', 3915, 'St. John Fisher University Wegmans',
  'CRNA Information Session; CRNA Virtual Information Session; CRNA Virtual Information Session', 'Join us for an Information Session to learn about Fisher’s CRNA program and to have your questions answered. See success at Fisher!',
  '2025-11-10',
  '3:00 PM - 4:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3919_1', 3919, 'Ursuline College',
  'UC Virtual Nurse Anesthesia Information Session', 'Attending an information session is the best way to learn more about the BSN-DNP Nurse Anesthesia program with Somnia Nurse Anesthesia Educational Programs (SNAP)! On the registration form, you have the option to attend the session live or to request the recording if you are unable to attend. ; Attending an information session is the best way to learn more about the BSN-DNP Nurse Anesthesia program with Somnia Nurse Anesthesia Educational Programs (SNAP)! On the registration form, you have the option to attend the session live or to request the recording if you are unable to attend.',
  '2025-09-23',
  '4:00 PM - 5:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3919_2', 3919, 'Ursuline College',
  'UC Virtual Nurse Anesthesia Information Session', 'Attending an information session is the best way to learn more about the BSN-DNP Nurse Anesthesia program with Somnia Nurse Anesthesia Educational Programs (SNAP)! On the registration form, you have the option to attend the session live or to request the recording if you are unable to attend. ; Attending an information session is the best way to learn more about the BSN-DNP Nurse Anesthesia program with Somnia Nurse Anesthesia Educational Programs (SNAP)! On the registration form, you have the option to attend the session live or to request the recording if you are unable to attend.',
  '2025-10-21',
  '11:00 AM - 12:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3919_3', 3919, 'Ursuline College',
  'UC Virtual Nurse Anesthesia Information Session', 'Attending an information session is the best way to learn more about the BSN-DNP Nurse Anesthesia program with Somnia Nurse Anesthesia Educational Programs (SNAP)! On the registration form, you have the option to attend the session live or to request the recording if you are unable to attend. ; Attending an information session is the best way to learn more about the BSN-DNP Nurse Anesthesia program with Somnia Nurse Anesthesia Educational Programs (SNAP)! On the registration form, you have the option to attend the session live or to request the recording if you are unable to attend.',
  '2025-11-18',
  '4:00 PM - 5:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3920_1', 3920, 'Villanova U Nurse Anesthesia Program',
  'Villanova DNP-NA Virtual Open House', 'Learn more about Villanova''s post-baccalaureate Nurse Anesthesia Doctor of Nursing Practice track during an on-campus Open House. This event will be held in person and virtually.',
  '2024-10-16',
  '4:00 PM - 6:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3921_1', 3921, 'Duquesne University - COMING SOON',
  'DUQ DNP in Nurse Anesthesia Virtual Information Session', 'Please join us to hear more about our DNP in Nurse Anesthesia Program!',
  '2024-10-22',
  '12:00 PM - 1:00 PM', 'EST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3924_1', 3924, 'Texas Christian University School of Nurse Anesthesia',
  'TCU DNAP In-Person Tour; TCU DNAP Virtual Information Session; TCU DNAP In-Person Tour; TCU DNAP In-Person Tour; TCU DNAP In-Person Tour', 'Fall 2024 Tour; Fall 2024 Information Session; Fall 2024 Tour; Fall 2024 Tour; Fall 2024 Tour',
  '2024-10-18',
  '12:30 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3924_2', 3924, 'Texas Christian University School of Nurse Anesthesia',
  'TCU DNAP In-Person Tour; TCU DNAP Virtual Information Session; TCU DNAP In-Person Tour; TCU DNAP In-Person Tour; TCU DNAP In-Person Tour', 'Fall 2024 Tour; Fall 2024 Information Session; Fall 2024 Tour; Fall 2024 Tour; Fall 2024 Tour',
  '2024-10-23',
  '4:00 PM - 5:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3924_3', 3924, 'Texas Christian University School of Nurse Anesthesia',
  'TCU DNAP In-Person Tour; TCU DNAP Virtual Information Session; TCU DNAP In-Person Tour; TCU DNAP In-Person Tour; TCU DNAP In-Person Tour', 'Fall 2024 Tour; Fall 2024 Information Session; Fall 2024 Tour; Fall 2024 Tour; Fall 2024 Tour',
  '2024-10-25',
  '12:30 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3924_4', 3924, 'Texas Christian University School of Nurse Anesthesia',
  'TCU DNAP In-Person Tour; TCU DNAP Virtual Information Session; TCU DNAP In-Person Tour; TCU DNAP In-Person Tour; TCU DNAP In-Person Tour', 'Fall 2024 Tour; Fall 2024 Information Session; Fall 2024 Tour; Fall 2024 Tour; Fall 2024 Tour',
  '2024-11-15',
  '12:30 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3924_5', 3924, 'Texas Christian University School of Nurse Anesthesia',
  'TCU DNAP In-Person Tour; TCU DNAP Virtual Information Session; TCU DNAP In-Person Tour; TCU DNAP In-Person Tour; TCU DNAP In-Person Tour', 'Fall 2024 Tour; Fall 2024 Information Session; Fall 2024 Tour; Fall 2024 Tour; Fall 2024 Tour',
  '2024-11-22',
  '1:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3925_1', 3925, 'Texas Wesleyan University Graduate Programs of Nurse Anesthesia',
  'TXWes CRNA Online Information Session', 'Ready to start your career as a CRNA? Sign up for the next online info session and learn more about going from RN to CRNA in our top-tier Doctor of Nurse Anesthesia Practice program. You''ll get info on classes, the admissions process, clinicals and more.',
  '2025-09-17',
  '1:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3925_2', 3925, 'Texas Wesleyan University Graduate Programs of Nurse Anesthesia',
  'TXWes CRNA Online Information Session', 'Ready to start your career as a CRNA? Sign up for the next online info session and learn more about going from RN to CRNA in our top-tier Doctor of Nurse Anesthesia Practice program. You''ll get info on classes, the admissions process, clinicals and more.',
  '2025-09-24',
  '1:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3925_3', 3925, 'Texas Wesleyan University Graduate Programs of Nurse Anesthesia',
  'TXWes CRNA Online Information Session', 'Ready to start your career as a CRNA? Sign up for the next online info session and learn more about going from RN to CRNA in our top-tier Doctor of Nurse Anesthesia Practice program. You''ll get info on classes, the admissions process, clinicals and more.',
  '2025-10-15',
  '1:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3925_4', 3925, 'Texas Wesleyan University Graduate Programs of Nurse Anesthesia',
  'TXWes CRNA Online Information Session', 'Ready to start your career as a CRNA? Sign up for the next online info session and learn more about going from RN to CRNA in our top-tier Doctor of Nurse Anesthesia Practice program. You''ll get info on classes, the admissions process, clinicals and more.',
  '2025-10-22',
  '1:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3925_5', 3925, 'Texas Wesleyan University Graduate Programs of Nurse Anesthesia',
  'TXWes CRNA Online Information Session', 'Ready to start your career as a CRNA? Sign up for the next online info session and learn more about going from RN to CRNA in our top-tier Doctor of Nurse Anesthesia Practice program. You''ll get info on classes, the admissions process, clinicals and more.',
  '2025-11-12',
  '1:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3925_6', 3925, 'Texas Wesleyan University Graduate Programs of Nurse Anesthesia',
  'TXWes CRNA Online Information Session', 'Ready to start your career as a CRNA? Sign up for the next online info session and learn more about going from RN to CRNA in our top-tier Doctor of Nurse Anesthesia Practice program. You''ll get info on classes, the admissions process, clinicals and more.',
  '2025-11-19',
  '1:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3925_7', 3925, 'Texas Wesleyan University Graduate Programs of Nurse Anesthesia',
  'TXWes CRNA Online Information Session', 'Ready to start your career as a CRNA? Sign up for the next online info session and learn more about going from RN to CRNA in our top-tier Doctor of Nurse Anesthesia Practice program. You''ll get info on classes, the admissions process, clinicals and more.',
  NULL,
  '1:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3926_1', 3926, 'University of Texas Jane and Robert Cizik School of Nursing at Houston Nurse Anesthesia Division',
  'UTH BSN to DNP Nurse Anesthesia Information Session', NULL,
  NULL,
  'TBA', NULL,
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;

INSERT INTO school_events (
  id, school_id, school_name, name, description, event_date, event_time, timezone, event_type, is_virtual
) VALUES (
  'event_3927_1', 3927, 'The University of Texas Medical Branch School',
  'Nurse Anesthesia Open House', 'Join us for our Nurse Anesthesia Open House! You will hear about admission requirements, the application process, and program curriculum for our Nurse Anesthesia program. We will also host a brief Q+A session at the end with faculty and admissions staff!',
  '2025-11-10',
  '7:00 PM - 8:00 PM', 'CST',
  'info_session', TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  event_date = EXCLUDED.event_date,
  event_time = EXCLUDED.event_time;


-- ============================================================
-- VERIFY IMPORT
-- ============================================================
-- SELECT COUNT(*) as total_events FROM school_events;
