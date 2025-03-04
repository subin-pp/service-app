import React, { useState, useEffect } from 'react';
import { Table, Form, Card, Button, Container } from 'react-bootstrap';
import AdminHeader from '../../componets/AdminHeader';
import Footer from '../../componets/Footer';
import { getAllUsersAPI, blockUserAPI, unblockUserAPI } from '../../services/Allapi';

const AdminUserManage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = { 
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json" 
      };
      
      const response = await getAllUsersAPI(headers);
      console.log(response);

      if (response.status === 200 && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Block / Unblock user
  const handleBlockUnblock = async (userId, isBlocked) => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = { 
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json" 
      };

      if (isBlocked) {
        await unblockUserAPI(headers, userId);
      } else {
        await blockUserAPI(headers, userId);
      }

      fetchUsers(); // Refresh user list after action
    } catch (error) {
      console.error(`Error ${isBlocked ? 'unblocking' : 'blocking'} user:`, error);
    }
  };

  const getStatusBadge = (isBlocked) => {
    return (
      <span style={{ color: isBlocked ? 'red' : 'green', fontWeight: 'bold' }}>
        {isBlocked ? 'Blocked' : 'Active'}
      </span>
    );
  };

  return (
    <>
      <AdminHeader />
      <Container className="py-4" style={{ marginTop: '80px' }}>
        <Card className="shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">User Management</h2>
              <Form.Control
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '250px' }}
              />
            </div>

            <Table hover responsive className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(user =>
                    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.phoneNumber.includes(searchTerm)
                  )
                  .map(user => (
                    <tr key={user._id}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{getStatusBadge(user.isBlocked)}</td>
                      <td>
                        <Button 
                          variant={user.isBlocked ? 'success' : 'danger'} 
                          size="sm"
                          onClick={() => handleBlockUnblock(user._id, user.isBlocked)}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default AdminUserManage;
