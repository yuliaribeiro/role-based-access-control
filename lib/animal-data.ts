export interface Animal {
  id: number
  name: string
  weight: string
  species: string
  gender: string
}

export const ANIMALS: Animal[] = [
  { id: 1, name: "Luna", weight: "4.2 kg", species: "Felis catus", gender: "Female" },
  { id: 2, name: "Max", weight: "28.5 kg", species: "Canis lupus familiaris", gender: "Male" },
  { id: 3, name: "Koko", weight: "0.9 kg", species: "Psittacus erithacus", gender: "Female" },
  { id: 4, name: "Bubbles", weight: "0.03 kg", species: "Carassius auratus", gender: "Male" },
  { id: 5, name: "Thor", weight: "52.0 kg", species: "Canis lupus familiaris", gender: "Male" },
  { id: 6, name: "Whiskers", weight: "5.1 kg", species: "Felis catus", gender: "Male" },
]
