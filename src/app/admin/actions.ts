"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify, serializePerks } from "@/lib/utils";

const placeSchema = z.object({
  name: z.string().trim().min(2).max(120),
  city: z.string().trim().min(1).max(80),
  state: z.string().trim().max(80).optional().or(z.literal("")),
  country: z.string().trim().min(1).max(80).default("India"),
  description: z.string().trim().min(10),
  imageUrl: z.string().trim().min(5),
  featured: z.string().optional().nullable(),
});

const activitySchema = z.object({
  name: z.string().trim().min(2).max(120),
  placeId: z.string().min(1),
  category: z.string().trim().min(2).max(60),
  price: z.coerce.number().int().positive(),
  description: z.string().trim().min(10),
  imageUrl: z.string().trim().min(5),
  duration: z.string().trim().max(40).optional().or(z.literal("")),
  minAge: z.coerce.number().int().nonnegative().optional().nullable(),
  featured: z.string().optional().nullable(),
});

const cardPlanSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(80),
  value: z.coerce.number().int().positive(),
  price: z.coerce.number().int().positive(),
  perks: z.string().trim(),
  active: z.string().optional().nullable(),
});

function formValue(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function on(err: string) {
  throw new Error(err);
}

export async function upsertPlace(formData: FormData) {
  await requireAdmin();
  const id = formValue(formData, "id");
  const data = placeSchema.parse({
    name: formValue(formData, "name"),
    city: formValue(formData, "city"),
    state: formValue(formData, "state"),
    country: formValue(formData, "country") || "India",
    description: formValue(formData, "description"),
    imageUrl: formValue(formData, "imageUrl"),
    featured: formData.get("featured"),
  });

  const slug = slugify(data.name);
  const record = {
    name: data.name,
    slug,
    city: data.city,
    state: data.state || null,
    country: data.country,
    description: data.description,
    imageUrl: data.imageUrl,
    featured: !!data.featured,
  };

  if (id) {
    const existing = await prisma.place.findUnique({ where: { id } });
    if (!existing) on("Place not found");
    const clash = await prisma.place.findFirst({ where: { slug, NOT: { id } } });
    if (clash) on("A place with this name already exists");
    await prisma.place.update({ where: { id }, data: record });
  } else {
    await prisma.place.create({ data: record });
  }
  revalidatePath("/", "layout");
  redirect("/admin/places");
}

export async function deletePlace(id: string) {
  await requireAdmin();
  await prisma.place.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/places");
}

export async function upsertActivity(formData: FormData) {
  await requireAdmin();
  const id = formValue(formData, "id");
  const data = activitySchema.parse({
    name: formValue(formData, "name"),
    placeId: formValue(formData, "placeId"),
    category: formValue(formData, "category"),
    price: formValue(formData, "price"),
    description: formValue(formData, "description"),
    imageUrl: formValue(formData, "imageUrl"),
    duration: formValue(formData, "duration"),
    minAge: formValue(formData, "minAge") ? Number(formValue(formData, "minAge")) : null,
    featured: formData.get("featured"),
  });

  const slug = slugify(data.name);
  const record = {
    name: data.name,
    slug,
    placeId: data.placeId,
    category: data.category,
    price: data.price,
    description: data.description,
    imageUrl: data.imageUrl,
    duration: data.duration || null,
    minAge: data.minAge,
    featured: !!data.featured,
  };

  if (id) {
    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) on("Activity not found");
    const clash = await prisma.activity.findFirst({ where: { slug, NOT: { id } } });
    if (clash) on("An activity with this name already exists");
    await prisma.activity.update({ where: { id }, data: record });
  } else {
    await prisma.activity.create({ data: record });
  }
  revalidatePath("/", "layout");
  redirect("/admin/activities");
}

export async function deleteActivity(id: string) {
  await requireAdmin();
  await prisma.activity.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/activities");
}

export async function upsertCardPlan(formData: FormData) {
  await requireAdmin();
  const id = formValue(formData, "id");
  const data = cardPlanSchema.parse({
    id: id || undefined,
    name: formValue(formData, "name"),
    value: formValue(formData, "value"),
    price: formValue(formData, "price"),
    perks: formValue(formData, "perks"),
    active: formData.get("active"),
  });

  const perks = data.perks
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const record = {
    name: data.name,
    value: data.value,
    price: data.price,
    perks: serializePerks(perks),
    active: !!data.active,
  };

  if (data.id) {
    await prisma.cardPlan.update({ where: { id: data.id }, data: record });
  } else {
    await prisma.cardPlan.create({ data: record });
  }
  revalidatePath("/", "layout");
  redirect("/admin/cards");
}

export async function deleteCardPlan(id: string) {
  await requireAdmin();
  await prisma.cardPlan.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/cards");
}

export async function toggleUserRole(userId: string) {
  await requireAdmin();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) on("User not found");
  await prisma.user.update({
    where: { id: userId },
    data: { role: user!.role === "ADMIN" ? "USER" : "ADMIN" },
  });
  revalidatePath("/admin/users");
}

export async function createAdminUser() {
  await requireAdmin();
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@horizonactivity.in";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "Admin@1234";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const bcrypt = await import("bcryptjs");
    await prisma.user.create({
      data: {
        name: "Site Admin",
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: "ADMIN",
      },
    });
  }
  revalidatePath("/admin/users");
}
