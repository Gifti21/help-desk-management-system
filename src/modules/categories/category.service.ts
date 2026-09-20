import { CategoryRepository } from "./category.repository";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto";
import { ConflictError, NotFoundError } from "@/src/shared/errors/AppError";

export class CategoryService {
    private repository: CategoryRepository;

    constructor() {
        this.repository = new CategoryRepository();
    }

    async getAllCategories() {
        return await this.repository.findAll();
    }

    async getCategoryById(id: string) {
        const category = await this.repository.findById(id);

        if (!category) {
            throw new NotFoundError("Category not found");
        }

        return category;
    }

    async createCategory(dto: CreateCategoryDto) {
        const existing = await this.repository.findByName(dto.name);

        if (existing) {
            throw new ConflictError("Category with this name already exists");
        }

        return await this.repository.create({ name: dto.name });
    }

    async updateCategory(id: string, dto: UpdateCategoryDto) {
        await this.getCategoryById(id);

        if (dto.name) {
            const existing = await this.repository.findByName(dto.name);
            if (existing && existing.id !== id) {
                throw new ConflictError("Category with this name already exists");
            }
        }

        return await this.repository.update(id, dto);
    }

    async deleteCategory(id: string) {
        await this.getCategoryById(id);
        return await this.repository.delete(id);
    }
}
