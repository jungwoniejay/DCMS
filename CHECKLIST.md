# 📋 Brgy2DMS Installation Checklist

## Pre-Installation Checklist

### System Requirements
- [ ] PHP 8.2 or higher installed
- [ ] Composer installed
- [ ] Node.js 18+ installed
- [ ] NPM installed
- [ ] PostgreSQL 12+ installed
- [ ] PostgreSQL service running

### Verification
- [ ] Run `verify.bat` to check all requirements
- [ ] All checks passed

---

## Installation Checklist

### Step 1: Database Setup
- [ ] PostgreSQL is running
- [ ] Database `brgy2dms` created
- [ ] Database credentials updated in `.env` file
- [ ] Can connect to database

### Step 2: Dependencies
- [ ] Run `setup.bat` OR follow manual steps below:
  - [ ] `composer install` completed
  - [ ] `npm install` completed
  - [ ] No errors during installation

### Step 3: Database Migration
- [ ] `php artisan migrate:fresh --seed` completed
- [ ] All 11 tables created
- [ ] Sample data seeded (3 children)
- [ ] No migration errors

### Step 4: Build Assets
- [ ] `npm run build` completed (or skip for dev mode)
- [ ] No build errors

---

## Post-Installation Checklist

### Server Start
- [ ] `composer run dev` running OR
- [ ] `php artisan serve` running in Terminal 1
- [ ] `npm run dev` running in Terminal 2
- [ ] No startup errors

### Application Access
- [ ] Browser opens http://localhost:8000
- [ ] Dashboard loads successfully
- [ ] No console errors in browser DevTools

### Feature Testing
- [ ] Dashboard displays statistics
  - [ ] Total Children: 3
  - [ ] Pending: 1
  - [ ] Approved: 2
  - [ ] Male/Female: 2/1

- [ ] Recent registrations table shows 3 children
  - [ ] Juan Dela Cruz (Approved)
  - [ ] Ana Reyes (Pending)
  - [ ] Miguel Garcia (Approved)

- [ ] Navigation works
  - [ ] "Register New Child" button works
  - [ ] "Children Registry" link works
  - [ ] "View All Children" link works

### Children Registry Page
- [ ] Children list displays all 3 children
- [ ] Search box works
- [ ] "View" buttons work
- [ ] "Edit" buttons work
- [ ] Status badges display correctly

### Registration Form
- [ ] "Register New Child" page loads
- [ ] Step 1: Child Information form displays
- [ ] Step 2: Guardian Information form displays
- [ ] Form validation works
- [ ] Can add multiple guardians
- [ ] Can add multiple emergency contacts
- [ ] "Register Child" button works

### Child Profile View
- [ ] Click "View" on any child
- [ ] Profile page loads
- [ ] Child information displays
- [ ] Guardian information displays
- [ ] Emergency contacts display
- [ ] Status badge displays
- [ ] "Edit Profile" button works
- [ ] "Back to Children" link works

### Child Profile Edit
- [ ] Click "Edit" on any child
- [ ] Edit page loads
- [ ] Tabs display (Basic Info, Parents, Family, Details)
- [ ] Basic Info tab shows form
- [ ] Form fields are populated
- [ ] Can update information
- [ ] "Save Changes" button works
- [ ] "Back to Profile" link works

---

## Database Verification

### Tables Created
- [ ] children
- [ ] guardians
- [ ] emergency_contacts
- [ ] father_profiles
- [ ] mother_profiles
- [ ] family_profiles
- [ ] child_details
- [ ] siblings
- [ ] prior_experiences
- [ ] performance_inputs
- [ ] logistics

### Sample Data
- [ ] 3 children records
- [ ] 4 guardian records
- [ ] 1 emergency contact record
- [ ] 1 father profile
- [ ] 1 mother profile
- [ ] 1 family profile
- [ ] 1 child detail record

---

## Troubleshooting Checklist

If something doesn't work:

### Database Issues
- [ ] PostgreSQL service is running
- [ ] Database `brgy2dms` exists
- [ ] Credentials in `.env` are correct
- [ ] Can connect using: `psql -U postgres -d brgy2dms`

### Server Issues
- [ ] Port 8000 is not in use by another application
- [ ] Laravel server started without errors
- [ ] Check `storage/logs/laravel.log` for errors

### Frontend Issues
- [ ] Vite dev server is running
- [ ] No errors in terminal
- [ ] Browser console shows no errors
- [ ] Assets are loading (check Network tab)

### Build Issues
- [ ] `node_modules` folder exists
- [ ] `vendor` folder exists
- [ ] `.env` file exists
- [ ] `APP_KEY` is set in `.env`

---

## Final Verification

### All Systems Go ✅
- [ ] Dashboard loads and displays data
- [ ] Can view children list
- [ ] Can register new child
- [ ] Can view child profile
- [ ] Can edit child profile
- [ ] Search works
- [ ] No errors in browser console
- [ ] No errors in Laravel logs
- [ ] All sample data displays correctly

---

## Success Criteria

✅ **System is ready when:**
1. All checkboxes above are checked
2. Dashboard shows statistics
3. 3 sample children are visible
4. All CRUD operations work
5. No errors in console or logs

---

## Next Steps After Installation

- [ ] Read SYSTEM_OVERVIEW.md for detailed documentation
- [ ] Explore all features
- [ ] Test registration workflow
- [ ] Customize as needed
- [ ] Add remaining form fields (optional)
- [ ] Deploy to production (when ready)

---

## Quick Commands Reference

```bash
# Verify system
verify.bat

# Install everything
setup.bat

# Start development
composer run dev

# Or separately
php artisan serve
npm run dev

# Database commands
php artisan migrate:fresh --seed
php artisan db:seed

# Build for production
npm run build
```

---

## Support Files

- [ ] README.md - Read for complete guide
- [ ] QUICKSTART.md - Read for quick setup
- [ ] SYSTEM_OVERVIEW.md - Read for full documentation
- [ ] INSTALLATION.md - Read for detailed instructions

---

**Installation Complete!** 🎉

If all checkboxes are checked, your system is ready to use!

Start managing child development data: http://localhost:8000
