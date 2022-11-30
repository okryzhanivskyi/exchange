const getExtension = (fileName: string) => fileName.split('.').pop();

const getUniqueSuffix = () => `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

export const getFileName = (fieldName: string, fileName: string) => {
  return `${fieldName}-${getUniqueSuffix()}.${getExtension(fileName)}`;
}
