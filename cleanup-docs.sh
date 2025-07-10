#!/bin/bash

# 🧹 Documentation Cleanup Script
# This script helps you transition to the new centralized documentation system

echo "🌟 Starting API Documentation Cleanup..."
echo ""

# Create backup directory
echo "📦 Creating backup directory..."
mkdir -p ./backup/old-docs
echo "✅ Backup directory created"

# Backup old files before removal
echo ""
echo "💾 Backing up old documentation files..."

if [ -f "./src/config/swagger.config.ts" ]; then
    cp "./src/config/swagger.config.ts" "./backup/old-docs/"
    echo "✅ Backed up swagger.config.ts"
fi

if [ -f "./src/utils/swagger-docs.helper.ts" ]; then
    cp "./src/utils/swagger-docs.helper.ts" "./backup/old-docs/"
    echo "✅ Backed up swagger-docs.helper.ts"
fi

if [ -f "./src/utils/swagger.helpers.ts" ]; then
    cp "./src/utils/swagger.helpers.ts" "./backup/old-docs/"
    echo "✅ Backed up swagger.helpers.ts"
fi

# List files that can be removed (user decides)
echo ""
echo "🗑️  Files that can be removed (now redundant):"
echo "   • src/config/swagger.config.ts (replaced by docs.config.ts)"
echo "   • src/utils/swagger-docs.helper.ts (functionality moved to docs.config.ts)"
echo "   • src/utils/swagger.helpers.ts (if exists)"
echo ""

# Show documentation-related files that might need cleanup
echo "📋 Documentation files to review:"
find . -name "*.md" -path "./docs/*" | grep -E "(SWAGGER|swagger)" | head -10
echo ""

echo "🎯 Next Steps:"
echo "   1. Test new documentation: yarn dev then visit http://localhost:3001/api-docs"
echo "   2. Update your routes with JSDoc comments (see user.routes.documented.ts example)"
echo "   3. Remove old files when you're confident everything works"
echo "   4. Update any imports that reference old swagger.config.ts"
echo ""

echo "🚀 New Documentation Endpoints:"
echo "   • Swagger UI:    /api-docs"
echo "   • OpenAPI JSON:  /api-docs.json"
echo "   • Health Check:  /api/health"
echo "   • Postman:       /postman-collection.json"
echo ""

echo "✅ Cleanup preparation complete!"
echo "💡 All old files have been backed up to ./backup/old-docs/"
echo ""

# Show a summary of what's been improved
echo "🌟 Documentation System Improvements:"
echo "   ✅ Centralized schema management"
echo "   ✅ Standardized response templates"  
echo "   ✅ Industry-standard OpenAPI 3.0"
echo "   ✅ Multiple documentation formats"
echo "   ✅ Simplified JSDoc syntax"
echo "   ✅ Better developer experience"
echo ""

echo "🎉 Your API documentation is now enterprise-ready!"
