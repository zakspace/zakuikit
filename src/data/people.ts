/**
 * ZAKUIKit Docs — sample dataset used across table, grid and chart demos.
 */

export interface Person {
  id: number;
  name: string;
  initials: string;
  email: string;
  role: string;
  team: string;
  status: 'active' | 'invited' | 'suspended';
  location: string;
  joined: string;
  usage: number;
  balance: number;
}

const RAW: Array<[string, string, string, string, Person['status'], string, string]> = [
  ['Alina Popescu', 'Frontend Engineer', 'Platform', 'alina.popescu@zakui.dev', 'active', 'Bucharest', '2024-02-11'],
  ['Marcus Webb', 'Staff Engineer', 'Platform', 'marcus.webb@zakui.dev', 'active', 'London', '2023-11-03'],
  ['Priya Raman', 'Product Designer', 'Design', 'priya.raman@zakui.dev', 'active', 'Bengaluru', '2024-01-22'],
  ['Tom Okafor', 'Data Engineer', 'Data', 'tom.okafor@zakui.dev', 'active', 'Lagos', '2023-09-15'],
  ['Sofia Marchetti', 'Engineering Manager', 'Platform', 'sofia.marchetti@zakui.dev', 'active', 'Milan', '2022-06-30'],
  ['Jonas Lindqvist', 'DevOps Engineer', 'Infra', 'jonas.lindqvist@zakui.dev', 'active', 'Stockholm', '2023-04-18'],
  ['Mei Chen', 'Senior Engineer', 'Data', 'mei.chen@zakui.dev', 'active', 'Singapore', '2022-10-05'],
  ['Diego Fuentes', 'Solutions Architect', 'Sales Eng', 'diego.fuentes@zakui.dev', 'invited', 'Madrid', '2024-03-02'],
  ['Hannah Fischer', 'QA Engineer', 'Quality', 'hannah.fischer@zakui.dev', 'active', 'Berlin', '2023-07-21'],
  ['Omar Al-Rashid', 'Security Engineer', 'Infra', 'omar.al-rashid@zakui.dev', 'active', 'Dubai', '2023-02-09'],
  ['Grace Bennett', 'Technical Writer', 'Docs', 'grace.bennett@zakui.dev', 'active', 'Toronto', '2024-04-14'],
  ['Ivan Petrov', 'Backend Engineer', 'Platform', 'ivan.petrov@zakui.dev', 'suspended', 'Sofia', '2022-12-01'],
  ['Amara Nwosu', 'Product Manager', 'Product', 'amara.nwosu@zakui.dev', 'active', 'Abuja', '2023-05-27'],
  ['Lucas Moreau', 'UX Researcher', 'Design', 'lucas.moreau@zakui.dev', 'active', 'Paris', '2023-08-19'],
  ['Yuki Tanaka', 'Mobile Engineer', 'Mobile', 'yuki.tanaka@zakui.dev', 'invited', 'Osaka', '2024-02-28'],
  ['Elena Vasquez', 'Site Reliability', 'Infra', 'elena.vasquez@zakui.dev', 'active', 'Mexico City', '2022-08-12'],
  ['Noah Kim', 'Growth Engineer', 'Growth', 'noah.kim@zakui.dev', 'active', 'Seoul', '2023-10-30'],
  ['Fatima Zahra', 'Support Lead', 'Support', 'fatima.zahra@zakui.dev', 'active', 'Casablanca', '2023-03-16'],
  ['Oliver Jensen', 'Pricing Analyst', 'Finance', 'oliver.jensen@zakui.dev', 'active', 'Copenhagen', '2023-12-11'],
  ['Rin Nakamura', 'Accessibility Engineer', 'Quality', 'rin.nakamura@zakui.dev', 'active', 'Tokyo', '2024-01-08'],
  ['Samuel Adeyemi', 'Platform Engineer', 'Platform', 'samuel.adeyemi@zakui.dev', 'invited', 'Accra', '2024-03-22'],
  ['Nadia Haddad', 'Localization Lead', 'Docs', 'nadia.haddad@zakui.dev', 'active', 'Beirut', '2023-06-04'],
  ['Peter Novak', 'Compliance Analyst', 'Legal', 'peter.novak@zakui.dev', 'active', 'Prague', '2022-11-17'],
  ['Camila Duarte', 'Sales Engineer', 'Sales Eng', 'camila.duarte@zakui.dev', 'active', 'São Paulo', '2023-01-25'],
];

const TEAM_OF: Record<string, string> = {};

export const people: Person[] = RAW.map(([name, role, team, email, status, location, joined], index) => {
  TEAM_OF[email] = team;
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  const seed = name.length * 7 + index * 13;
  return {
    id: index + 1,
    name,
    initials,
    email,
    role,
    team,
    status,
    location,
    joined,
    usage: 40 + ((seed * 17) % 260),
    balance: Math.round((seed * 137.4) % 9900) / 1 + 100,
  };
});

export const teams = [...new Set(people.map((p) => p.team))].sort();
export const statuses: Person['status'][] = ['active', 'invited', 'suspended'];

/** Deterministic 24-point series for chart demos. */
export function series(seed: number, length = 24, base = 40, wave = 30): number[] {
  return Array.from({ length }, (_, i) => {
    const t = i / (length - 1);
    const wave1 = Math.sin(t * Math.PI * (1.5 + (seed % 3))) * wave;
    const wave2 = Math.cos(t * Math.PI * (2 + (seed % 4))) * (wave / 2.4);
    const drift = t * (seed % 25);
    return Math.max(4, Math.round(base + wave1 + wave2 + drift));
  });
}

export const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
