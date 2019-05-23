import {HistoryItem, TrainingDay, TrainingPlan, Workout} from './ApiClient';

class WorkoutHistoryItem {
}

export class DataFactory {

    public static createTrainingDay(name: string, workouts: Workout[]) {
        const day = new TrainingDay();
        day.id = 0;
        day.name = name;
        day.workouts = workouts;
        return day;
    }

    public static createTrainingPlan(name: string, days: TrainingDay[]) {
        const plan = new TrainingPlan();
        plan.id = 0;
        plan.name = name;
        plan.days = days;
        return plan;
    }

    public static createWorkoutHistoryItem(workout: Workout, repetitions: number, sets: number, weight: number) {
        const item = new HistoryItem();
        item.id = 0;
        item.date = new Date();
        item.repetitions = repetitions;
        item.sets = sets;
        item.weight = weight;
        item.workout = workout;
        return item;
    }

    public static createWorkout(name: string) {
        const workout = new Workout();
        workout.id = 0;
        workout.name = name;
        return workout;
    }


}
