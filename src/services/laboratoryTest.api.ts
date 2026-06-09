import { http } from "./http";

export const getLaboratoryTests = async () => {
  const allItems: any[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await http.get(
      `/laboratory-test/?limit=${limit}&offset=${offset}`
    );
    const data = res.data;
    allItems.push(...data.objects);
    if (!data.meta.next) break;
    offset += limit;
  }

  return allItems;
};