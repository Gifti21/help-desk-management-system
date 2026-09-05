import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { developmentOnly } from "@/lib/development-only";

/**
 * GET /api/test/categories - Test categories retrieval (no auth required)
 */
export async function GET(request: NextRequest) {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    console.log("=== TESTING CATEGORIES ===");

    // Get all categories
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    console.log(`Found ${categories.length} categories:`, categories);

    return NextResponse.json({
      success: true,
      message: `Found ${categories.length} categories`,
      data: {
        categories,
        count: categories.length,
      },
    });
  } catch (error: any) {
    console.error("❌ Categories test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/test/categories - Create test categories
 */
export async function POST(request: NextRequest) {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    console.log("=== CREATING TEST CATEGORIES ===");

    const testCategories = [
      { name: "Hardware Issue" },
      { name: "Software Issue" },
      { name: "Network Issue" },
      { name: "Account Access" },
      { name: "Other" },
    ];

    // Create categories (using upsert to avoid duplicates)
    const results = [];
    for (const categoryData of testCategories) {
      const category = await prisma.category.upsert({
        where: { name: categoryData.name },
        update: {},
        create: categoryData,
        select: { id: true, name: true },
      });
      results.push(category);
      console.log(`✅ Category: ${category.name} (${category.id})`);
    }

    console.log(`Created/verified ${results.length} categories`);

    return NextResponse.json({
      success: true,
      message: `Created/verified ${results.length} categories`,
      data: {
        categories: results,
        count: results.length,
      },
    });
  } catch (error: any) {
    console.error("❌ Create categories failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create categories",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
