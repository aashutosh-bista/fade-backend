import { Member } from "../models/member.model.js";
import type { CreateMemberInput } from "../validators/member.validator.js";

export const createMemberService = async (data: CreateMemberInput) => {
  return Member.create(data);
};

export const listMembersService = async (page: number, limit: number) => {
  const [items, total] = await Promise.all([
    Member.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Member.countDocuments(),
  ]);
  return { items, total, page, limit };
};