import { DepartmentRepository } from "./department.repository";
import { CreateDepartmentDto, UpdateDepartmentDto } from "./department.dto";
import { ConflictError, NotFoundError } from "@/src/shared/errors/AppError";

export class DepartmentService {
    private repository: DepartmentRepository;

    constructor() {
        this.repository = new DepartmentRepository();
    }

    async getAllDepartments() {
        return await this.repository.findAll();
    }

    async getDepartmentById(id: string) {
        const department = await this.repository.findById(id);

        if (!department) {
            throw new NotFoundError("Department not found");
        }

        return department;
    }

    async createDepartment(dto: CreateDepartmentDto) {
        // Check for duplicate name
        const existing = await this.repository.findByName(dto.name);

        if (existing) {
            throw new ConflictError("Department with this name already exists");
        }

        return await this.repository.create({
            name: dto.name,
        });
    }

    async updateDepartment(id: string, dto: UpdateDepartmentDto) {
        // Verify department exists
        await this.getDepartmentById(id);

        // Check for duplicate name if name is being updated
        if (dto.name) {
            const existing = await this.repository.findByName(dto.name);
            if (existing && existing.id !== id) {
                throw new ConflictError("Department with this name already exists");
            }
        }

        return await this.repository.update(id, dto);
    }

    async deleteDepartment(id: string) {
        // Verify department exists
        await this.getDepartmentById(id);

        return await this.repository.delete(id);
    }
}
