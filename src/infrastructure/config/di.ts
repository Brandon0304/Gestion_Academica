import { prisma } from '../persistence/prisma-client.js'
import { PrismaUserRepository, PrismaStudentRepository, PrismaTeacherRepository, PrismaSubjectRepository, PrismaAcademicPeriodRepository, PrismaClassroomRepository, PrismaCourseRepository, PrismaEnrollmentRepository, PrismaGradeRepository, PrismaStudyPlanRepository } from '../persistence/repositories/index.js'
import { JwtTokenService } from '../auth/jwt-token.service.js'
import { BcryptPasswordHasher } from '../auth/bcrypt-password-hasher.js'

import { LoginUseCase, GetMeUseCase, RegisterStudentUseCase, ChangePasswordUseCase, RefreshTokenUseCase } from '../../application/use-cases/auth/index.js'
import { ListUsersUseCase, UpdateUserUseCase } from '../../application/use-cases/users/index.js'
import { CreateStudentUseCase, GetStudentUseCase, ListStudentsUseCase, UpdateStudentUseCase, DeleteStudentUseCase } from '../../application/use-cases/students/index.js'
import { CreateTeacherUseCase, GetTeacherUseCase, ListTeachersUseCase, UpdateTeacherUseCase, DeleteTeacherUseCase } from '../../application/use-cases/teachers/index.js'
import { CreateSubjectUseCase, GetSubjectUseCase, ListSubjectsUseCase, UpdateSubjectUseCase, DeleteSubjectUseCase } from '../../application/use-cases/subjects/index.js'
import { CreateAcademicPeriodUseCase, GetAcademicPeriodUseCase, ListAcademicPeriodsUseCase, UpdateAcademicPeriodUseCase, DeleteAcademicPeriodUseCase } from '../../application/use-cases/academic-periods/index.js'
import { CreateClassroomUseCase, GetClassroomUseCase, ListClassroomsUseCase, UpdateClassroomUseCase, DeleteClassroomUseCase } from '../../application/use-cases/classrooms/index.js'
import { CreateCourseUseCase, GetCourseUseCase, ListCoursesUseCase, UpdateCourseUseCase, DeleteCourseUseCase, ChangeCourseStatusUseCase } from '../../application/use-cases/courses/index.js'
import { CreateEnrollmentUseCase, GetEnrollmentUseCase, ListEnrollmentsUseCase, ChangeEnrollmentStatusUseCase } from '../../application/use-cases/enrollments/index.js'
import { CreateGradeUseCase, GetGradesByEnrollmentUseCase, UpdateGradeUseCase, DeleteGradeUseCase, CalculateFinalGradeUseCase } from '../../application/use-cases/grades/index.js'
import { CreateStudyPlanUseCase, GetStudyPlanUseCase, ListStudyPlansUseCase, UpdateStudyPlanUseCase, DeleteStudyPlanUseCase } from '../../application/use-cases/study-plans/index.js'
import { StudentAcademicHistoryUseCase, CourseGradeReportUseCase } from '../../application/use-cases/reports/index.js'
import { GetStudentTimetableUseCase, GetTeacherTimetableUseCase } from '../../application/use-cases/timetable/index.js'

import { AuthController } from '../../presentation/controllers/auth.controller.js'
import { UsersController } from '../../presentation/controllers/users.controller.js'
import { StudentsController } from '../../presentation/controllers/students.controller.js'
import { TeachersController } from '../../presentation/controllers/teachers.controller.js'
import { SubjectsController } from '../../presentation/controllers/subjects.controller.js'
import { AcademicPeriodsController } from '../../presentation/controllers/academic-periods.controller.js'
import { ClassroomsController } from '../../presentation/controllers/classrooms.controller.js'
import { CoursesController } from '../../presentation/controllers/courses.controller.js'
import { EnrollmentsController } from '../../presentation/controllers/enrollments.controller.js'
import { GradesController } from '../../presentation/controllers/grades.controller.js'
import { StudyPlansController } from '../../presentation/controllers/study-plans.controller.js'
import { ReportsController } from '../../presentation/controllers/reports.controller.js'
import { TimetableController } from '../../presentation/controllers/timetable.controller.js'
import { PrismaAuditLogRepository } from '../persistence/repositories/prisma-audit-log.repository.js'
import { AuditService } from '../../domain/services/audit-service.js'
import { EnrollmentValidator } from '../../domain/services/enrollment-validator.js'
import { GradeCalculator } from '../../domain/services/grade-calculator.js'
import { ConsoleEmailSender } from '../email/console-email-sender.js'
import { NotificationService } from '../../domain/services/notification-service.js'

// Services
const tokenService = new JwtTokenService()
const passwordHasher = new BcryptPasswordHasher()

// Repositories
const userRepository = new PrismaUserRepository(prisma)
const studentRepository = new PrismaStudentRepository(prisma)
const teacherRepository = new PrismaTeacherRepository(prisma)
const subjectRepository = new PrismaSubjectRepository(prisma)
const academicPeriodRepository = new PrismaAcademicPeriodRepository(prisma)
const classroomRepository = new PrismaClassroomRepository(prisma)
const courseRepository = new PrismaCourseRepository(prisma)
const enrollmentRepository = new PrismaEnrollmentRepository(prisma)
const gradeRepository = new PrismaGradeRepository(prisma)
const studyPlanRepository = new PrismaStudyPlanRepository(prisma)

// Auth use cases
const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService)
const getMeUseCase = new GetMeUseCase(userRepository)
const registerStudentUseCase = new RegisterStudentUseCase(userRepository, studentRepository, passwordHasher, tokenService)
const changePasswordUseCase = new ChangePasswordUseCase(userRepository, passwordHasher)
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService)

// User use cases
const listUsersUseCase = new ListUsersUseCase(userRepository)
const updateUserUseCase = new UpdateUserUseCase(userRepository)

// Domain services
const emailSender = new ConsoleEmailSender()
const auditLogRepository = new PrismaAuditLogRepository(prisma)
export const auditService = new AuditService(auditLogRepository)
export const notificationService = new NotificationService(emailSender)
const enrollmentValidator = new EnrollmentValidator(academicPeriodRepository, courseRepository, enrollmentRepository, subjectRepository)

// Student use cases
const createStudentUseCase = new CreateStudentUseCase(studentRepository, auditService)
const getStudentUseCase = new GetStudentUseCase(studentRepository)
const listStudentsUseCase = new ListStudentsUseCase(studentRepository)
const updateStudentUseCase = new UpdateStudentUseCase(studentRepository)
const deleteStudentUseCase = new DeleteStudentUseCase(studentRepository)

// Teacher use cases
const createTeacherUseCase = new CreateTeacherUseCase(teacherRepository, auditService)
const getTeacherUseCase = new GetTeacherUseCase(teacherRepository)
const listTeachersUseCase = new ListTeachersUseCase(teacherRepository)
const updateTeacherUseCase = new UpdateTeacherUseCase(teacherRepository)
const deleteTeacherUseCase = new DeleteTeacherUseCase(teacherRepository)

// Subject use cases
const createSubjectUseCase = new CreateSubjectUseCase(subjectRepository)
const getSubjectUseCase = new GetSubjectUseCase(subjectRepository)
const listSubjectsUseCase = new ListSubjectsUseCase(subjectRepository)
const updateSubjectUseCase = new UpdateSubjectUseCase(subjectRepository)
const deleteSubjectUseCase = new DeleteSubjectUseCase(subjectRepository)

// Academic period use cases
const createAcademicPeriodUseCase = new CreateAcademicPeriodUseCase(academicPeriodRepository)
const getAcademicPeriodUseCase = new GetAcademicPeriodUseCase(academicPeriodRepository)
const listAcademicPeriodsUseCase = new ListAcademicPeriodsUseCase(academicPeriodRepository)
const updateAcademicPeriodUseCase = new UpdateAcademicPeriodUseCase(academicPeriodRepository)
const deleteAcademicPeriodUseCase = new DeleteAcademicPeriodUseCase(academicPeriodRepository)

// Classroom use cases
const createClassroomUseCase = new CreateClassroomUseCase(classroomRepository)
const getClassroomUseCase = new GetClassroomUseCase(classroomRepository)
const listClassroomsUseCase = new ListClassroomsUseCase(classroomRepository)
const updateClassroomUseCase = new UpdateClassroomUseCase(classroomRepository)
const deleteClassroomUseCase = new DeleteClassroomUseCase(classroomRepository)

// Course use cases (mapper shared)
const createCourseUseCase = new CreateCourseUseCase(courseRepository)
const getCourseUseCase = new GetCourseUseCase(courseRepository, enrollmentRepository, createCourseUseCase)
const listCoursesUseCase = new ListCoursesUseCase(courseRepository)
const updateCourseUseCase = new UpdateCourseUseCase(courseRepository, enrollmentRepository, createCourseUseCase)
const deleteCourseUseCase = new DeleteCourseUseCase(courseRepository)
const changeCourseStatusUseCase = new ChangeCourseStatusUseCase(courseRepository, enrollmentRepository, createCourseUseCase, auditService)

// Enrollment use cases
const createEnrollmentUseCase = new CreateEnrollmentUseCase(enrollmentRepository, enrollmentValidator, auditService, notificationService)
const getEnrollmentUseCase = new GetEnrollmentUseCase(enrollmentRepository)
const listEnrollmentsUseCase = new ListEnrollmentsUseCase(enrollmentRepository)
const changeEnrollmentStatusUseCase = new ChangeEnrollmentStatusUseCase(enrollmentRepository, auditService)

// Grade services + use cases
const gradeCalculator = new GradeCalculator(gradeRepository, enrollmentRepository)
const createGradeUseCase = new CreateGradeUseCase(gradeRepository, auditService, notificationService)
const getGradesByEnrollmentUseCase = new GetGradesByEnrollmentUseCase(gradeRepository)
const updateGradeUseCase = new UpdateGradeUseCase(gradeRepository)
const deleteGradeUseCase = new DeleteGradeUseCase(gradeRepository)
const calculateFinalGradeUseCase = new CalculateFinalGradeUseCase(gradeCalculator)

// Study Plan use cases
const createStudyPlanUseCase = new CreateStudyPlanUseCase(studyPlanRepository)
const getStudyPlanUseCase = new GetStudyPlanUseCase(studyPlanRepository)
const listStudyPlansUseCase = new ListStudyPlansUseCase(studyPlanRepository)
const updateStudyPlanUseCase = new UpdateStudyPlanUseCase(studyPlanRepository)
const deleteStudyPlanUseCase = new DeleteStudyPlanUseCase(studyPlanRepository)

// Reports use cases
const studentAcademicHistoryUseCase = new StudentAcademicHistoryUseCase(studentRepository, enrollmentRepository, gradeRepository, courseRepository, academicPeriodRepository)
const courseGradeReportUseCase = new CourseGradeReportUseCase(courseRepository, enrollmentRepository, studentRepository, teacherRepository, academicPeriodRepository)

// Timetable use cases
const getStudentTimetableUseCase = new GetStudentTimetableUseCase(studentRepository, enrollmentRepository, courseRepository, teacherRepository, classroomRepository)
const getTeacherTimetableUseCase = new GetTeacherTimetableUseCase(courseRepository, teacherRepository, classroomRepository)

// Controllers
export const authController = new AuthController(loginUseCase, getMeUseCase, tokenService, registerStudentUseCase, changePasswordUseCase, refreshTokenUseCase)
export const usersController = new UsersController(listUsersUseCase, updateUserUseCase)
export const studentsController = new StudentsController(createStudentUseCase, getStudentUseCase, listStudentsUseCase, updateStudentUseCase, deleteStudentUseCase)
export const teachersController = new TeachersController(createTeacherUseCase, getTeacherUseCase, listTeachersUseCase, updateTeacherUseCase, deleteTeacherUseCase)
export const subjectsController = new SubjectsController(createSubjectUseCase, getSubjectUseCase, listSubjectsUseCase, updateSubjectUseCase, deleteSubjectUseCase)
export const academicPeriodsController = new AcademicPeriodsController(createAcademicPeriodUseCase, getAcademicPeriodUseCase, listAcademicPeriodsUseCase, updateAcademicPeriodUseCase, deleteAcademicPeriodUseCase)
export const classroomsController = new ClassroomsController(createClassroomUseCase, getClassroomUseCase, listClassroomsUseCase, updateClassroomUseCase, deleteClassroomUseCase)
export const coursesController = new CoursesController(createCourseUseCase, getCourseUseCase, listCoursesUseCase, updateCourseUseCase, deleteCourseUseCase, changeCourseStatusUseCase)
export const enrollmentsController = new EnrollmentsController(createEnrollmentUseCase, getEnrollmentUseCase, listEnrollmentsUseCase, changeEnrollmentStatusUseCase)
export const gradesController = new GradesController(createGradeUseCase, getGradesByEnrollmentUseCase, updateGradeUseCase, deleteGradeUseCase, calculateFinalGradeUseCase)
export const studyPlansController = new StudyPlansController(createStudyPlanUseCase, getStudyPlanUseCase, listStudyPlansUseCase, updateStudyPlanUseCase, deleteStudyPlanUseCase)
export const reportsController = new ReportsController(studentAcademicHistoryUseCase, courseGradeReportUseCase)
export const timetableController = new TimetableController(getStudentTimetableUseCase, getTeacherTimetableUseCase)

export { tokenService, studentRepository, teacherRepository, courseRepository, enrollmentRepository }
