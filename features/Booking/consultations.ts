export const consultations = [
  {
    key: "license",
    calLink: "iuliia-andreeva-ierhh1/20min",
    namespace: "license-consultation",
  },
  {
    key: "immigration",
    calLink: "iuliia-andreeva-ierhh1/30min",
    namespace: "immigration-consultation",
  },
] as const;

export type ConsultationKey = (typeof consultations)[number]["key"];
