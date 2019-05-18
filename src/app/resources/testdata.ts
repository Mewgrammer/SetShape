import {EWorkoutType} from './models/interfaces';
import {TrainingPlan, Workout, WorkoutHistoryItem} from './models/entities';
import {DataFactory} from './factory';

const workoutBankDruecken: Workout = DataFactory.createWorkout("Bank Drücken", EWorkoutType.BankDruecken, 5, 3, 50);
const workoutButterfly: Workout = DataFactory.createWorkout("Butterfly", EWorkoutType.Butterfly, 15, 3, 30);
const workoutTrizeps: Workout = DataFactory.createWorkout("Trizeps Curls", EWorkoutType.TrizepsCurls, 5, 2, 50);
const workoutDips: Workout = DataFactory.createWorkout("Dips", EWorkoutType.Dips, 6, 1, 10);

export const testHistory: WorkoutHistoryItem[] = [
    DataFactory.createWorkoutHistoryItem(workoutBankDruecken),
    DataFactory.createWorkoutHistoryItem(workoutBankDruecken),
    DataFactory.createWorkoutHistoryItem(workoutButterfly),
    DataFactory.createWorkoutHistoryItem(workoutTrizeps),
    DataFactory.createWorkoutHistoryItem(workoutTrizeps),
    DataFactory.createWorkoutHistoryItem(workoutDips),
];

export const testPlan: TrainingPlan = DataFactory.createTrainingPlan("Test Plan", [
   DataFactory.createTrainingDay("Test Tag 1", [workoutBankDruecken, workoutButterfly]),
   DataFactory.createTrainingDay("Test Tag 2", [workoutTrizeps, workoutButterfly]),
   DataFactory.createTrainingDay("Test Tag 3", [workoutBankDruecken, workoutDips]),
   DataFactory.createTrainingDay("Test Tag 4", [workoutButterfly, workoutTrizeps]),
]);

export class TestData {
    public static plan: TrainingPlan = testPlan;
    public static history: WorkoutHistoryItem[] = testHistory;
    public static workouts: Workout[] = [
        workoutButterfly,
        workoutTrizeps,
        workoutBankDruecken,
        workoutDips
    ];
}


