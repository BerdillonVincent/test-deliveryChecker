export interface ValidationError {
  status: "error";
  error_code: string;
  error_message: string;
}

export interface SuccessResult {
  status: "success";
  steps: StepT[];
}

export type ActionT = "pickup" | "dropoff" | null;
export type DeliveryT = [number, number];
export type PathT = number[];
export type StepT = { address: number; action: ActionT };
