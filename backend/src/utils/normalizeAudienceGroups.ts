const ALL_YEARS = [1, 2, 3, 4];
const ALL_SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const ALL_SECTIONS = ["A", "B", "C", "D"];

const TIER2 = [
  "ASSOCIATE_PROFR", "ASSISTANT_PROFR", "PROFR", "HOD", "REGISTRAR", "CLERKS", "COORDINATOR"
];
const TIER0 = [
  "GUEST", "ALUMINI", "ADMIN"
];

export const normalizeAudienceGroups = (groups: {
  include?: boolean;
  userType: string;
  department?: string[];
  year?: number[] | ["ALL"];
  semester?: number[] | ["ALL"];
  section?: string[] | ["ALL"];
  usns?: string[];
}[]) => {
  return groups.map(group => {
    let newYears = group.year;
    let newSemesters = group.semester;
    let newSections = group.section;

    if (group.year && group.year[0] === "ALL") {
      newYears = ALL_YEARS;
    }
    if (group.semester && group.semester[0] === "ALL") {
      newSemesters = ALL_SEMESTERS;
    }
    if (group.section && group.section[0] === "ALL") {
      newSections = ALL_SECTIONS;
    }

    if (group.userType === "STUDENT") {
      return {
        ...group,
        year: newYears ?? ALL_YEARS,
        semester: newSemesters ?? ALL_SEMESTERS,
        section: newSections ?? ALL_SECTIONS,
      };
    }

    if (TIER2.includes(group.userType)) {
      return {
        ...group,
        year: undefined,
        semester: undefined,
        section: undefined,
      };
    }

    if (TIER0.includes(group.userType)) {
      return {
        ...group,
        department: [],
        year: undefined,
        semester: undefined,
        section: undefined,
      };
    }

    return {
      ...group,
      year: undefined,
      semester: undefined,
      section: undefined,
    };
  });
};
