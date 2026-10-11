import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { createMemberSchema } from "../validators/member.validator.js";
import { paginationSchema } from "../validators/common.validator.js";
import { createMemberService, listMembersService } from "../services/member.service.js";

export const createMember = asyncHandler(async (req, res) => {
  const data = createMemberSchema.parse(req.body);
  const member = await createMemberService(data);
  res.status(201).json(apiResponse("Member created successfully", member));
});

export const getMembers = asyncHandler(async (req, res) => {
  const { page, limit } = paginationSchema.parse(req.query);
  const result = await listMembersService(page, limit);
  res.status(200).json(apiResponse("Members fetched successfully", result));
});