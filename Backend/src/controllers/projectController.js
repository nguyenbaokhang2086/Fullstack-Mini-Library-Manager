import * as projectService from '../services/projectService.js';
import { success, error } from '../utils/response.js';

export const create = async (req, res) => {
  try {
    // req.body cần có: name, description, owner (là ID của user)
    const newProject = await projectService.createProject(req.body);
    return success(res, 'Tạo dự án thành công', newProject, 201);
  } catch (err) {
    return error(res, 'Lỗi tạo dự án', 500, err.message);
  }
};

export const getAll = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    return success(res, 'Lấy danh sách dự án thành công', projects);
  } catch (err) {
    return error(res, 'Lỗi hệ thống', 500, err.message);
  }
};

export const getDetail = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) return error(res, 'Không tìm thấy dự án', 404, 'PROJECT_NOT_FOUND');
    return success(res, 'Lấy chi tiết thành công', project);
  } catch (err) {
    return error(res, 'Lỗi hệ thống', 500, err.message);
  }
};
export const update = async (req, res) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    if (!project) return error(res, 'Không tìm thấy dự án để cập nhật', 404, 'PROJECT_NOT_FOUND');
    return success(res, 'Cập nhật dự án thành công', project);
  } catch (err) {
    return error(res, 'Lỗi hệ thống', 500, err.message);
  }
};

export const remove = async (req, res) => {
  try {
    const project = await projectService.deleteProject(req.params.id);
    if (!project) return error(res, 'Không tìm thấy dự án để xóa', 404, 'PROJECT_NOT_FOUND');
    return success(res, 'Xóa dự án thành công');
  } catch (err) {
    return error(res, 'Lỗi hệ thống', 500, err.message);
  }
};