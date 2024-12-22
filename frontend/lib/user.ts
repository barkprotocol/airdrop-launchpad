import prisma from './db';

// Function to get all users
export async function getAllUsers() {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Unable to fetch users');
  }
}

// Function to get a user by ID
export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(`Error fetching user with ID: ${id}`, error);
    throw new Error(`Unable to fetch user with ID: ${id}`);
  }
}

// Function to create a new user
export async function createUser(data: { name: string; email: string }) {
  try {
    return await prisma.user.create({
      data,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Unable to create user');
  }
}

// Function to update a user by ID
export async function updateUser(id: string, data: { name?: string; email?: string }) {
  try {
    return await prisma.user.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error(`Error updating user with ID: ${id}`, error);
    throw new Error(`Unable to update user with ID: ${id}`);
  }
}

// Function to delete a user by ID
export async function deleteUser(id: string) {
  try {
    return await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting user with ID: ${id}`, error);
    throw new Error(`Unable to delete user with ID: ${id}`);
  }
}

// Function to check if user exists by email
export async function userExistsByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user !== null;
  } catch (error) {
    console.error(`Error checking if user exists with email: ${email}`, error);
    throw new Error(`Unable to check user existence with email: ${email}`);
  }
}

// Example of a transaction: Create user and associate them with a role (atomic operations)
export async function createUserWithRole(data: { name: string; email: string; role: string }) {
  const { name, email, role } = data;

  try {
    // Perform multiple operations inside a transaction
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: { name, email },
      });

      await prisma.role.create({
        data: {
          userId: user.id,
          roleName: role,
        },
      });

      return user; // Returning the created user
    });

    return result; // Returning the user created
  } catch (error) {
    console.error('Error creating user with role:', error);
    throw new Error('Unable to create user with role');
  }
}

// Function to update user data and user status atomically
export async function updateUserAndStatus(id: string, data: { name?: string; email?: string; status: string }) {
  try {
    // Perform multiple operations inside a transaction
    const result = await prisma.$transaction(async (prisma: { user: { update: (arg0: { where: { id: string; }; data: { name?: string; email?: string; status: string; }; }) => any; }; userStatus: { upsert: (arg0: { where: { userId: string; }; update: { status: string; }; create: { userId: string; status: string; }; }) => any; }; }) => {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...data, // Update name and email if provided
        },
      });

      const userStatus = await prisma.userStatus.upsert({
        where: { userId: id },
        update: { status: data.status },
        create: { userId: id, status: data.status },
      });

      return { user, userStatus };
    });

    return result;
  } catch (error) {
    console.error('Error updating user and status:', error);
    throw new Error('Unable to update user and status');
  }
}

// Function to delete a user and their associated data atomically
export async function deleteUserAndAssociatedData(id: string) {
  try {
    // Perform multiple delete operations inside a transaction
    const result = await prisma.$transaction(async (prisma: { user: { delete: (arg0: { where: { id: string; }; }) => any; }; userStatus: { deleteMany: (arg0: { where: { userId: string; }; }) => any; }; role: { deleteMany: (arg0: { where: { userId: string; }; }) => any; }; }) => {
      const user = await prisma.user.delete({
        where: { id },
      });

      // Optionally, delete related records from other tables (e.g., user status, roles)
      await prisma.userStatus.deleteMany({
        where: { userId: id },
      });

      await prisma.role.deleteMany({
        where: { userId: id },
      });

      return user; // Returning the deleted user
    });

    return result;
  } catch (error) {
    console.error('Error deleting user and associated data:', error);
    throw new Error('Unable to delete user and associated data');
  }
}
