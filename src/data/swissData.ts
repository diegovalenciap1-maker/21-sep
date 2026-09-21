export interface SwissRecord {
  id: string;
  district: string;
  Fertility: number;         // Ig: Medida estandarizada de fertilidad común
  Agriculture: number;       // % hombres involucrados en agricultura
  Examination: number;       // % reclutas militares con nota máxima en examen
  Education: number;         // % educación más allá de la primaria para reclutas
  Catholic: number;          // % católicos (en contraste con protestantes)
  InfantMortality: number;   // % nacidos vivos que fallecen antes de cumplir 1 año
  religionMajority?: 'Católica' | 'Protestante';
}

export const SWISS_VARIABLES: { key: keyof Omit<SwissRecord, 'id' | 'district' | 'religionMajority'>; name: string; desc: string; unit: string }[] = [
  { key: 'Fertility', name: 'Fertilidad', desc: 'Tasa estandarizada de fertilidad común', unit: 'índice' },
  { key: 'Agriculture', name: 'Agricultura', desc: 'Porcentaje de hombres dedicados a la agricultura', unit: '%' },
  { key: 'Examination', name: 'Examen Militar', desc: 'Porcentaje de reclutas con máxima puntuación en examen', unit: '%' },
  { key: 'Education', name: 'Educación', desc: 'Porcentaje de reclutas con educación secundaria/superior', unit: '%' },
  { key: 'Catholic', name: 'Catolicismo', desc: 'Porcentaje de población católica', unit: '%' },
  { key: 'InfantMortality', name: 'Mortalidad Infantil', desc: 'Porcentaje de nacidos vivos que mueren antes del primer año', unit: '%' },
];

export const SWISS_DATA: SwissRecord[] = [
  { id: '1', district: 'Courtelary', Fertility: 80.2, Agriculture: 17.0, Examination: 15, Education: 12, Catholic: 9.96, InfantMortality: 22.2, religionMajority: 'Protestante' },
  { id: '2', district: 'Delemont', Fertility: 83.1, Agriculture: 45.1, Examination: 6, Education: 9, Catholic: 84.84, InfantMortality: 22.2, religionMajority: 'Católica' },
  { id: '3', district: 'Franches-Mnt', Fertility: 92.5, Agriculture: 39.7, Examination: 5, Education: 5, Catholic: 93.40, InfantMortality: 20.2, religionMajority: 'Católica' },
  { id: '4', district: 'Moutier', Fertility: 85.8, Agriculture: 36.5, Examination: 12, Education: 7, Catholic: 33.77, InfantMortality: 20.3, religionMajority: 'Protestante' },
  { id: '5', district: 'Neuveville', Fertility: 76.9, Agriculture: 43.5, Examination: 17, Education: 15, Catholic: 5.16, InfantMortality: 20.6, religionMajority: 'Protestante' },
  { id: '6', district: 'Porrentruy', Fertility: 76.1, Agriculture: 35.3, Examination: 9, Education: 7, Catholic: 90.57, InfantMortality: 26.6, religionMajority: 'Católica' },
  { id: '7', district: 'Broye', Fertility: 83.8, Agriculture: 70.2, Examination: 16, Education: 7, Catholic: 92.85, InfantMortality: 23.6, religionMajority: 'Católica' },
  { id: '8', district: 'Glane', Fertility: 92.4, Agriculture: 67.8, Examination: 14, Education: 8, Catholic: 97.16, InfantMortality: 24.9, religionMajority: 'Católica' },
  { id: '9', district: 'Gruyere', Fertility: 82.4, Agriculture: 53.3, Examination: 12, Education: 7, Catholic: 97.67, InfantMortality: 21.0, religionMajority: 'Católica' },
  { id: '10', district: 'Sarine', Fertility: 82.9, Agriculture: 45.2, Examination: 16, Education: 13, Catholic: 91.38, InfantMortality: 24.4, religionMajority: 'Católica' },
  { id: '11', district: 'Veveyse', Fertility: 87.1, Agriculture: 64.5, Examination: 14, Education: 6, Catholic: 98.61, InfantMortality: 24.5, religionMajority: 'Católica' },
  { id: '12', district: 'Aigle', Fertility: 64.1, Agriculture: 62.0, Examination: 21, Education: 12, Catholic: 8.52, InfantMortality: 16.5, religionMajority: 'Protestante' },
  { id: '13', district: 'Aubonne', Fertility: 66.9, Agriculture: 67.5, Examination: 14, Education: 7, Catholic: 2.27, InfantMortality: 19.1, religionMajority: 'Protestante' },
  { id: '14', district: 'Avenches', Fertility: 68.9, Agriculture: 60.7, Examination: 19, Education: 12, Catholic: 4.43, InfantMortality: 16.5, religionMajority: 'Protestante' },
  { id: '15', district: 'Cossonay', Fertility: 61.7, Agriculture: 69.3, Examination: 22, Education: 5, Catholic: 2.82, InfantMortality: 16.5, religionMajority: 'Protestante' },
  { id: '16', district: 'Echallens', Fertility: 68.3, Agriculture: 72.6, Examination: 18, Education: 2, Catholic: 24.20, InfantMortality: 21.2, religionMajority: 'Protestante' },
  { id: '17', district: 'Grandson', Fertility: 71.7, Agriculture: 34.0, Examination: 17, Education: 8, Catholic: 3.30, InfantMortality: 20.0, religionMajority: 'Protestante' },
  { id: '18', district: 'Lausanne', Fertility: 55.7, Agriculture: 19.4, Examination: 26, Education: 28, Catholic: 12.11, InfantMortality: 20.2, religionMajority: 'Protestante' },
  { id: '19', district: 'La Vallee', Fertility: 54.3, Agriculture: 15.2, Examination: 31, Education: 20, Catholic: 2.15, InfantMortality: 10.8, religionMajority: 'Protestante' },
  { id: '20', district: 'Lavaux', Fertility: 65.1, Agriculture: 73.0, Examination: 19, Education: 9, Catholic: 2.84, InfantMortality: 20.0, religionMajority: 'Protestante' },
  { id: '21', district: 'Morges', Fertility: 65.5, Agriculture: 59.8, Examination: 22, Education: 10, Catholic: 5.23, InfantMortality: 18.0, religionMajority: 'Protestante' },
  { id: '22', district: 'Moudon', Fertility: 65.0, Agriculture: 55.1, Examination: 14, Education: 3, Catholic: 4.52, InfantMortality: 22.4, religionMajority: 'Protestante' },
  { id: '23', district: 'Nyons', Fertility: 56.6, Agriculture: 50.9, Examination: 22, Education: 12, Catholic: 15.14, InfantMortality: 16.7, religionMajority: 'Protestante' },
  { id: '24', district: 'Orbe', Fertility: 57.4, Agriculture: 54.1, Examination: 20, Education: 6, Catholic: 4.20, InfantMortality: 15.3, religionMajority: 'Protestante' },
  { id: '25', district: 'Oron', Fertility: 72.5, Agriculture: 71.2, Examination: 12, Education: 1, Catholic: 2.40, InfantMortality: 21.0, religionMajority: 'Protestante' },
  { id: '26', district: 'Payerne', Fertility: 74.2, Agriculture: 58.1, Examination: 14, Education: 8, Catholic: 5.23, InfantMortality: 23.8, religionMajority: 'Protestante' },
  { id: '27', district: 'Paysd\'enhaut', Fertility: 72.0, Agriculture: 63.5, Examination: 6, Education: 3, Catholic: 2.56, InfantMortality: 18.0, religionMajority: 'Protestante' },
  { id: '28', district: 'Rolle', Fertility: 60.5, Agriculture: 60.8, Examination: 16, Education: 10, Catholic: 7.72, InfantMortality: 16.3, religionMajority: 'Protestante' },
  { id: '29', district: 'Vevey', Fertility: 58.3, Agriculture: 26.8, Examination: 25, Education: 19, Catholic: 18.46, InfantMortality: 20.9, religionMajority: 'Protestante' },
  { id: '30', district: 'Yverdon', Fertility: 65.4, Agriculture: 48.7, Examination: 19, Education: 8, Catholic: 6.10, InfantMortality: 22.5, religionMajority: 'Protestante' },
  { id: '31', district: 'Conthey', Fertility: 75.5, Agriculture: 85.9, Examination: 3, Education: 2, Catholic: 99.71, InfantMortality: 15.1, religionMajority: 'Católica' },
  { id: '32', district: 'Entremont', Fertility: 69.3, Agriculture: 84.9, Examination: 7, Education: 6, Catholic: 99.68, InfantMortality: 19.8, religionMajority: 'Católica' },
  { id: '33', district: 'Herens', Fertility: 77.3, Agriculture: 89.7, Examination: 5, Education: 2, Catholic: 100.00, InfantMortality: 18.3, religionMajority: 'Católica' },
  { id: '34', district: 'Martigny', Fertility: 70.5, Agriculture: 78.2, Examination: 12, Education: 6, Catholic: 98.96, InfantMortality: 19.4, religionMajority: 'Católica' },
  { id: '35', district: 'Monthey', Fertility: 79.4, Agriculture: 64.9, Examination: 7, Education: 3, Catholic: 98.22, InfantMortality: 20.2, religionMajority: 'Católica' },
  { id: '36', district: 'St Maurice', Fertility: 65.0, Agriculture: 75.9, Examination: 9, Education: 9, Catholic: 99.06, InfantMortality: 17.8, religionMajority: 'Católica' },
  { id: '37', district: 'Sierre', Fertility: 92.2, Agriculture: 84.6, Examination: 3, Education: 3, Catholic: 99.46, InfantMortality: 16.3, religionMajority: 'Católica' },
  { id: '38', district: 'Sion', Fertility: 79.3, Agriculture: 63.1, Examination: 13, Education: 13, Catholic: 96.83, InfantMortality: 18.1, religionMajority: 'Católica' },
  { id: '39', district: 'Rive Droite', Fertility: 44.7, Agriculture: 46.6, Examination: 16, Education: 29, Catholic: 50.43, InfantMortality: 18.2, religionMajority: 'Católica' },
  { id: '40', district: 'Rive Gauche', Fertility: 42.8, Agriculture: 27.7, Examination: 22, Education: 29, Catholic: 58.33, InfantMortality: 19.3, religionMajority: 'Católica' },
  { id: '41', district: 'Val de Ruz', Fertility: 77.6, Agriculture: 37.6, Examination: 15, Education: 7, Catholic: 4.97, InfantMortality: 20.0, religionMajority: 'Protestante' },
  { id: '42', district: 'ValdeTravers', Fertility: 67.6, Agriculture: 18.7, Examination: 25, Education: 7, Catholic: 8.65, InfantMortality: 19.5, religionMajority: 'Protestante' },
  { id: '43', district: 'V. De Geneve', Fertility: 35.0, Agriculture: 1.2, Examination: 37, Education: 53, Catholic: 42.34, InfantMortality: 18.0, religionMajority: 'Protestante' },
  { id: '44', district: 'Neuchatel', Fertility: 64.4, Agriculture: 17.6, Examination: 35, Education: 32, Catholic: 16.92, InfantMortality: 23.0, religionMajority: 'Protestante' },
  { id: '45', district: 'Boudry', Fertility: 70.4, Agriculture: 38.4, Examination: 26, Education: 12, Catholic: 5.62, InfantMortality: 20.3, religionMajority: 'Protestante' },
  { id: '46', district: 'La Chauxdfnd', Fertility: 65.7, Agriculture: 7.7, Examination: 29, Education: 11, Catholic: 13.79, InfantMortality: 20.5, religionMajority: 'Protestante' },
  { id: '47', district: 'Le Locle', Fertility: 72.7, Agriculture: 16.7, Examination: 22, Education: 13, Catholic: 11.22, InfantMortality: 18.9, religionMajority: 'Protestante' },
];
