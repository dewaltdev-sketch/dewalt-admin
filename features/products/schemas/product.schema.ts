import * as yup from "yup";

export const productSchema = yup.object({
  name: yup.object({
    ka: yup.string().required("საჭიროა სახელის მითითება ქართულად"),
    en: yup.string().required("საჭიროა სახელის მითითება ინგლისურად"),
  }),

  finaId: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ||
      originalValue === null ||
      originalValue === undefined
        ? undefined
        : value
    )
    .optional()
    .integer("FINA ID უნდა იყოს მთელი რიცხვი")
    .min(1, "FINA ID უნდა იყოს დადებითი"),
  finaCode: yup
    .string()
    .transform((value) => (typeof value === "string" ? value.trim() : value))
    .optional(),
  description: yup.object({
    ka: yup.string().required("საჭიროა აღწერის მითითება ქართულად"),
    en: yup.string().required("საჭიროა აღწერის მითითება ინგლისურად"),
  }),
  image: yup.string().required("სურათის ბმულის მითითება სავალდებულოა"),
  images: yup
    .array()
    .of(yup.string())
    .max(6, "დანართი სურათების რაოდენობა არ უნდა აღემატებოდეს 6-ს")
    .optional(),
  price: yup
    .number()
    .required("ფასის მითითება სავალდებულოა")
    .min(0, "ფასი უნდა იყოს დადებითი"),
  originalPrice: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ||
      originalValue === null ||
      originalValue === undefined
        ? undefined
        : value
    )
    .optional()
    .min(0, "საწყისი ფასი უნდა იყოს დადებითი"),
  discount: yup
    .number()
    .optional()
    .min(0, "ფასდაკლება არ შეიძლება იყოს უარყოფითი")
    .max(100, "ფასდაკლება უნდა იყოს 0-დან 100-მდე"),
  quantity: yup
    .number()
    .required("მარაგის რაოდენობა სავალდებულოა")
    .min(0, "მარაგის რაოდენობა არ უნდა იყოს უარყოფითი")
    .integer("მარაგის რაოდენობა უნდა იყოს მთელი რიცხვი"),
  brandId: yup.string().required("ბრენდის არჩევა სავალდებულოა"),
  categoryId: yup.string().required("კატეგორიის არჩევა სავალდებულოა"),
  childCategoryId: yup.string().optional(),
  specs: yup
    .array()
    .of(
      yup.object({
        label: yup.object({
          ka: yup
            .string()
            .required("საჭიროა სპეციფიკაციის სახელწოდების მითითება ქართულად"),
          en: yup
            .string()
            .required("საჭიროა სპეციფიკაციის სახელწოდების მითითება ინგლისურად"),
        }),
        value: yup.object({
          ka: yup
            .string()
            .required("საჭიროა სპეციფიკაციის მნიშვნელობის მითითება ქართულად"),
          en: yup
            .string()
            .required("საჭიროა სპეციფიკაციის მნიშვნელობის მითითება ინგლისურად"),
        }),
      })
    )
    .optional(),
});
