# Development Guidelines

## Code Standards

### TypeScript
- Use strict mode (`strict: true`)
- Avoid `any` type—use explicit types
- Use interfaces for public APIs
- Use types for internal structures

### NestJS Backend

**Controller Structure:**
```typescript
@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateStudentDto) {
    return this.service.create(dto);
  }
}
```

**Service Business Logic:**
```typescript
@Injectable()
export class StudentsService {
  constructor(private readonly db: PrismaService) {}

  async create(dto: CreateStudentDto, libraryId: string) {
    // ALWAYS validate libraryId from authenticated user context
    // NEVER trust frontend-provided libraryId
    return this.db.student.create({
      data: { ...dto, libraryId }
    });
  }
}
```

**Key Practices:**
- Keep controllers thin (no business logic)
- Put all business logic in services
- Use dependency injection
- Validate all input via DTOs
- Enforce tenant isolation in every service method
- Use transactions for critical operations

### Next.js Frontend

**Page Structure:**
```typescript
export default function Page() {
  // Client-side state
  const [data, setData] = useState();

  // Effects
  useEffect(() => {
    // Fetch from API
  }, []);

  return <div>Page content</div>;
}
```

**Key Practices:**
- Mobile-first responsive design
- Server components where possible
- Client components for interactivity
- API calls via custom hooks
- Never put business logic in components
- Always use TypeScript strict mode

### Database (Prisma)

**Schema Conventions:**
- Use UUID for internal IDs
- Use Decimal(12,2) for money (never float)
- Use DateTime (UTC) for timestamps
- Use separate business_date fields for financial records
- Add indexes on frequently queried fields
- Use foreign key constraints
- Use transactions for multi-entity operations

**Migrations:**
```bash
# Create migration
npx prisma migrate dev --name description

# Review generated file in prisma/migrations/
# Test locally before committing
```

## Security Checklist

Before committing code:
- [ ] No secrets in code
- [ ] No OTP/tokens in logs
- [ ] Input validation on all endpoints
- [ ] Authentication on all protected routes
- [ ] Authorization checks in services
- [ ] Tenant isolation enforced
- [ ] No frontend-only security
- [ ] Rate limiting where appropriate
- [ ] Error messages don't leak internals
- [ ] Audit logging for sensitive actions

## Testing Requirements

Mandatory tests for:
- Student creation & duplicate validation
- Seat assignment & conflict detection
- Admission activation
- Fee calculation
- Payment allocation
- Attendance tracking
- Internet access decisions
- Device limits
- Overdue payment blocking
- Admin override functionality
- Tenant isolation
- RBAC enforcement

## Multi-Tenancy Golden Rules

1. **NEVER trust frontend libraryId**
   ```typescript
   // ❌ WRONG
   const admission = await db.admission.findFirst({
     where: { libraryId: req.body.libraryId }
   });

   // ✅ CORRECT
   const libraryId = req.user.libraryId; // From authenticated context
   const admission = await db.admission.findFirst({
     where: { id: req.params.id, libraryId }
   });
   ```

2. **Validate every query**
   ```typescript
   const libraryId = req.user.libraryId;
   const student = await db.student.findUnique({
     where: { id: studentId },
     include: { admission: true }
   });
   
   // Verify library access
   if (student.libraryId !== libraryId) {
     throw new ForbiddenException();
   }
   ```

3. **Use database constraints**
   ```prisma
   model Student {
     id        String   @id @default(uuid())
     libraryId String   @db.Uuid
     library   Library  @relation(fields: [libraryId], references: [id])
     
     @@index([libraryId])
   }
   ```

## Deployment

### Local Development
```bash
docker-compose up -d
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### Production
- Use environment-specific .env files
- Enable HTTPS
- Use Secure + SameSite cookies
- Enable CORS restrictively
- Setup backups
- Monitor logs
- Rate limit aggressively
- Rotate secrets regularly

## Git Workflow

1. Create feature branch from `main`
2. Make atomic commits
3. Write clear commit messages
4. Test before pushing
5. Create pull request with description
6. Address review comments
7. Merge to `main`

## Common Mistakes to Avoid

❌ **Don't:**
- Use floating-point for money
- Store plaintext OTPs
- Expose stack traces to users
- Delete audit/financial records
- Trust frontend authorization
- Use hardcoded configuration
- Skip input validation
- Implement security "later"

✅ **Do:**
- Use Decimal(12,2) for money
- Hash/encrypt sensitive data
- Log errors securely
- Mark records as inactive/void
- Enforce backend authorization
- Use environment configuration
- Validate all external input
- Implement security from day one

## References

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [OWASP Top 10](https://owasp.org/www-project-top-ten)
