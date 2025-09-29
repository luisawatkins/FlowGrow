import "FungibleToken"
import "FlowToken"
import "PropertyManagementContract"

/// Tenant Registry Contract for comprehensive tenant management
/// Handles tenant verification, lease management, and tenant operations
access(all) contract TenantRegistry {
    
    // ===== STRUCTS AND RESOURCES =====
    
    /// Tenant profile structure
    access(all) struct TenantProfile {
        pub let tenantId: UInt64
        pub let address: Address
        pub let name: String
        pub let email: String
        pub let phone: String
        pub let dateOfBirth: UInt64
        pub let ssn: String
        pub let employmentInfo: EmploymentInfo
        pub let creditScore: UInt32
        pub let income: UFix64
        pub let references: [Reference]
        pub let verificationStatus: String
        pub let kycStatus: String
        pub let amlStatus: String
        pub let riskScore: UInt32
        pub let reputationScore: UInt32
        pub let createdAt: UInt64
        pub let lastUpdated: UInt64
        pub let isActive: Bool
        
        init(
            tenantId: UInt64,
            address: Address,
            name: String,
            email: String,
            phone: String,
            dateOfBirth: UInt64,
            ssn: String,
            employmentInfo: EmploymentInfo,
            creditScore: UInt32,
            income: UFix64,
            references: [Reference]
        ) {
            self.tenantId = tenantId
            self.address = address
            self.name = name
            self.email = email
            self.phone = phone
            self.dateOfBirth = dateOfBirth
            self.ssn = ssn
            self.employmentInfo = employmentInfo
            self.creditScore = creditScore
            self.income = income
            self.references = references
            self.verificationStatus = "PENDING"
            self.kycStatus = "PENDING"
            self.amlStatus = "PENDING"
            self.riskScore = 0
            self.reputationScore = 0
            self.createdAt = getCurrentBlock().timestamp
            self.lastUpdated = getCurrentBlock().timestamp
            self.isActive = true
        }
    }
    
    /// Employment information structure
    access(all) struct EmploymentInfo {
        pub let employer: String
        pub let position: String
        pub let startDate: UInt64
        pub let salary: UFix64
        pub let employmentType: String
        pub let employerContact: String
        pub let isVerified: Bool
        
        init(
            employer: String,
            position: String,
            startDate: UInt64,
            salary: UFix64,
            employmentType: String,
            employerContact: String
        ) {
            self.employer = employer
            self.position = position
            self.startDate = startDate
            self.salary = salary
            self.employmentType = employmentType
            self.employerContact = employerContact
            self.isVerified = false
        }
    }
    
    /// Reference structure
    access(all) struct Reference {
        pub let referenceId: UInt64
        pub let name: String
        pub let relationship: String
        pub let contact: String
        pub let isVerified: Bool
        pub let rating: UInt32
        
        init(
            referenceId: UInt64,
            name: String,
            relationship: String,
            contact: String
        ) {
            self.referenceId = referenceId
            self.name = name
            self.relationship = relationship
            self.contact = contact
            self.isVerified = false
            self.rating = 0
        }
    }
    
    /// Lease agreement structure
    access(all) struct LeaseAgreement {
        pub let leaseId: UInt64
        pub let tenantId: UInt64
        pub let propertyId: UInt64
        pub let landlordAddress: Address
        pub let startDate: UInt64
        pub let endDate: UInt64
        pub let monthlyRent: UFix64
        pub let securityDeposit: UFix64
        pub let petDeposit: UFix64
        pub let lateFee: UFix64
        pub let leaseTerms: {String: String}
        pub let status: String
        pub let createdAt: UInt64
        pub let signedAt: UInt64?
        pub let terminatedAt: UInt64?
        pub let terminationReason: String?
        
        init(
            leaseId: UInt64,
            tenantId: UInt64,
            propertyId: UInt64,
            landlordAddress: Address,
            startDate: UInt64,
            endDate: UInt64,
            monthlyRent: UFix64,
            securityDeposit: UFix64,
            petDeposit: UFix64,
            lateFee: UFix64,
            leaseTerms: {String: String}
        ) {
            self.leaseId = leaseId
            self.tenantId = tenantId
            self.propertyId = propertyId
            self.landlordAddress = landlordAddress
            self.startDate = startDate
            self.endDate = endDate
            self.monthlyRent = monthlyRent
            self.securityDeposit = securityDeposit
            self.petDeposit = petDeposit
            self.lateFee = lateFee
            self.leaseTerms = leaseTerms
            self.status = "DRAFT"
            self.createdAt = getCurrentBlock().timestamp
            self.signedAt = nil
            self.terminatedAt = nil
            self.terminationReason = nil
        }
    }
    
    /// Tenant communication structure
    access(all) struct TenantCommunication {
        pub let communicationId: UInt64
        pub let tenantId: UInt64
        pub let propertyId: UInt64
        pub let sender: Address
        pub let recipient: Address
        pub let messageType: String
        pub let subject: String
        pub let message: String
        pub let timestamp: UInt64
        pub let isRead: Bool
        pub let priority: String
        
        init(
            communicationId: UInt64,
            tenantId: UInt64,
            propertyId: UInt64,
            sender: Address,
            recipient: Address,
            messageType: String,
            subject: String,
            message: String,
            priority: String
        ) {
            self.communicationId = communicationId
            self.tenantId = tenantId
            self.propertyId = propertyId
            self.sender = sender
            self.recipient = recipient
            self.messageType = messageType
            self.subject = subject
            self.message = message
            self.timestamp = getCurrentBlock().timestamp
            self.isRead = false
            self.priority = priority
        }
    }
    
    /// Tenant registry resource for property owners
    access(all) resource TenantRegistryManager {
        pub let owner: Address
        pub var tenants: {UInt64: TenantProfile}
        pub var leases: {UInt64: LeaseAgreement}
        pub var communications: {UInt64: [TenantCommunication]}
        pub var tenantProperties: {UInt64: [UInt64]} // tenantId -> propertyIds
        pub var propertyTenants: {UInt64: [UInt64]} // propertyId -> tenantIds
        
        init(owner: Address) {
            self.owner = owner
            self.tenants = {}
            self.leases = {}
            self.communications = {}
            self.tenantProperties = {}
            self.propertyTenants = {}
        }
        
        /// Register a new tenant
        access(all) fun registerTenant(
            tenantId: UInt64,
            address: Address,
            name: String,
            email: String,
            phone: String,
            dateOfBirth: UInt64,
            ssn: String,
            employmentInfo: EmploymentInfo,
            creditScore: UInt32,
            income: UFix64,
            references: [Reference]
        ): Bool {
            let tenantProfile = TenantProfile(
                tenantId: tenantId,
                address: address,
                name: name,
                email: email,
                phone: phone,
                dateOfBirth: dateOfBirth,
                ssn: ssn,
                employmentInfo: employmentInfo,
                creditScore: creditScore,
                income: income,
                references: references
            )
            self.tenants[tenantId] = tenantProfile
            self.tenantProperties[tenantId] = []
            return true
        }
        
        /// Update tenant verification status
        access(all) fun updateVerificationStatus(
            tenantId: UInt64,
            verificationStatus: String,
            kycStatus: String,
            amlStatus: String
        ): Bool {
            if let tenant = self.tenants[tenantId] {
                let updatedTenant = TenantProfile(
                    tenantId: tenant.tenantId,
                    address: tenant.address,
                    name: tenant.name,
                    email: tenant.email,
                    phone: tenant.phone,
                    dateOfBirth: tenant.dateOfBirth,
                    ssn: tenant.ssn,
                    employmentInfo: tenant.employmentInfo,
                    creditScore: tenant.creditScore,
                    income: tenant.income,
                    references: tenant.references
                )
                updatedTenant.verificationStatus = verificationStatus
                updatedTenant.kycStatus = kycStatus
                updatedTenant.amlStatus = amlStatus
                updatedTenant.lastUpdated = getCurrentBlock().timestamp
                self.tenants[tenantId] = updatedTenant
                return true
            }
            return false
        }
        
        /// Calculate tenant risk score
        access(all) fun calculateRiskScore(tenantId: UInt64): UInt32 {
            if let tenant = self.tenants[tenantId] {
                var riskScore: UInt32 = 0
                
                // Credit score factor (0-100)
                if tenant.creditScore < 600 {
                    riskScore = riskScore + 40
                } else if tenant.creditScore < 700 {
                    riskScore = riskScore + 20
                } else if tenant.creditScore < 750 {
                    riskScore = riskScore + 10
                }
                
                // Income to rent ratio factor
                let incomeToRentRatio = tenant.income / 3000.0 // Assuming $3000 average rent
                if incomeToRentRatio < 3.0 {
                    riskScore = riskScore + 30
                } else if incomeToRentRatio < 4.0 {
                    riskScore = riskScore + 15
                }
                
                // Employment verification factor
                if !tenant.employmentInfo.isVerified {
                    riskScore = riskScore + 20
                }
                
                // Reference verification factor
                var verifiedReferences = 0
                for reference in tenant.references {
                    if reference.isVerified {
                        verifiedReferences = verifiedReferences + 1
                    }
                }
                if verifiedReferences < 2 {
                    riskScore = riskScore + 15
                }
                
                // KYC/AML status factor
                if tenant.kycStatus != "VERIFIED" {
                    riskScore = riskScore + 25
                }
                if tenant.amlStatus != "CLEAR" {
                    riskScore = riskScore + 30
                }
                
                return min(riskScore, 100)
            }
            return 100
        }
        
        /// Update tenant risk and reputation scores
        access(all) fun updateTenantScores(tenantId: UInt64): Bool {
            if let tenant = self.tenants[tenantId] {
                let riskScore = self.calculateRiskScore(tenantId: tenantId)
                let reputationScore = self.calculateReputationScore(tenantId: tenantId)
                
                let updatedTenant = TenantProfile(
                    tenantId: tenant.tenantId,
                    address: tenant.address,
                    name: tenant.name,
                    email: tenant.email,
                    phone: tenant.phone,
                    dateOfBirth: tenant.dateOfBirth,
                    ssn: tenant.ssn,
                    employmentInfo: tenant.employmentInfo,
                    creditScore: tenant.creditScore,
                    income: tenant.income,
                    references: tenant.references
                )
                updatedTenant.verificationStatus = tenant.verificationStatus
                updatedTenant.kycStatus = tenant.kycStatus
                updatedTenant.amlStatus = tenant.amlStatus
                updatedTenant.riskScore = riskScore
                updatedTenant.reputationScore = reputationScore
                updatedTenant.lastUpdated = getCurrentBlock().timestamp
                self.tenants[tenantId] = updatedTenant
                return true
            }
            return false
        }
        
        /// Calculate tenant reputation score
        access(all) fun calculateReputationScore(tenantId: UInt64): UInt32 {
            if let tenant = self.tenants[tenantId] {
                var reputationScore: UInt32 = 50 // Base score
                
                // Payment history factor
                let paymentHistory = self.getTenantPaymentHistory(tenantId: tenantId)
                var onTimePayments = 0
                var totalPayments = 0
                
                for payment in paymentHistory {
                    totalPayments = totalPayments + 1
                    if !payment.isLate {
                        onTimePayments = onTimePayments + 1
                    }
                }
                
                if totalPayments > 0 {
                    let onTimeRate = UFix64(onTimePayments) / UFix64(totalPayments)
                    if onTimeRate >= 0.95 {
                        reputationScore = reputationScore + 30
                    } else if onTimeRate >= 0.90 {
                        reputationScore = reputationScore + 20
                    } else if onTimeRate >= 0.80 {
                        reputationScore = reputationScore + 10
                    } else {
                        reputationScore = reputationScore - 20
                    }
                }
                
                // Lease compliance factor
                let leaseHistory = self.getTenantLeaseHistory(tenantId: tenantId)
                var completedLeases = 0
                var terminatedLeases = 0
                
                for lease in leaseHistory {
                    if lease.status == "COMPLETED" {
                        completedLeases = completedLeases + 1
                    } else if lease.status == "TERMINATED" {
                        terminatedLeases = terminatedLeases + 1
                    }
                }
                
                if completedLeases > terminatedLeases {
                    reputationScore = reputationScore + 20
                } else if terminatedLeases > completedLeases {
                    reputationScore = reputationScore - 30
                }
                
                return min(max(reputationScore, 0), 100)
            }
            return 0
        }
        
        /// Create a lease agreement
        access(all) fun createLeaseAgreement(
            leaseId: UInt64,
            tenantId: UInt64,
            propertyId: UInt64,
            landlordAddress: Address,
            startDate: UInt64,
            endDate: UInt64,
            monthlyRent: UFix64,
            securityDeposit: UFix64,
            petDeposit: UFix64,
            lateFee: UFix64,
            leaseTerms: {String: String}
        ): Bool {
            let leaseAgreement = LeaseAgreement(
                leaseId: leaseId,
                tenantId: tenantId,
                propertyId: propertyId,
                landlordAddress: landlordAddress,
                startDate: startDate,
                endDate: endDate,
                monthlyRent: monthlyRent,
                securityDeposit: securityDeposit,
                petDeposit: petDeposit,
                lateFee: lateFee,
                leaseTerms: leaseTerms
            )
            self.leases[leaseId] = leaseAgreement
            
            // Update tenant-property relationships
            if let properties = self.tenantProperties[tenantId] {
                self.tenantProperties[tenantId] = properties.concat([propertyId])
            } else {
                self.tenantProperties[tenantId] = [propertyId]
            }
            
            if let tenants = self.propertyTenants[propertyId] {
                self.propertyTenants[propertyId] = tenants.concat([tenantId])
            } else {
                self.propertyTenants[propertyId] = [tenantId]
            }
            
            return true
        }
        
        /// Sign lease agreement
        access(all) fun signLeaseAgreement(leaseId: UInt64): Bool {
            if let lease = self.leases[leaseId] {
                let updatedLease = LeaseAgreement(
                    leaseId: lease.leaseId,
                    tenantId: lease.tenantId,
                    propertyId: lease.propertyId,
                    landlordAddress: lease.landlordAddress,
                    startDate: lease.startDate,
                    endDate: lease.endDate,
                    monthlyRent: lease.monthlyRent,
                    securityDeposit: lease.securityDeposit,
                    petDeposit: lease.petDeposit,
                    lateFee: lease.lateFee,
                    leaseTerms: lease.leaseTerms
                )
                updatedLease.status = "ACTIVE"
                updatedLease.signedAt = getCurrentBlock().timestamp
                self.leases[leaseId] = updatedLease
                return true
            }
            return false
        }
        
        /// Terminate lease agreement
        access(all) fun terminateLeaseAgreement(
            leaseId: UInt64,
            terminationReason: String
        ): Bool {
            if let lease = self.leases[leaseId] {
                let updatedLease = LeaseAgreement(
                    leaseId: lease.leaseId,
                    tenantId: lease.tenantId,
                    propertyId: lease.propertyId,
                    landlordAddress: lease.landlordAddress,
                    startDate: lease.startDate,
                    endDate: lease.endDate,
                    monthlyRent: lease.monthlyRent,
                    securityDeposit: lease.securityDeposit,
                    petDeposit: lease.petDeposit,
                    lateFee: lease.lateFee,
                    leaseTerms: lease.leaseTerms
                )
                updatedLease.status = "TERMINATED"
                updatedLease.terminatedAt = getCurrentBlock().timestamp
                updatedLease.terminationReason = terminationReason
                self.leases[leaseId] = updatedLease
                return true
            }
            return false
        }
        
        /// Send communication to tenant
        access(all) fun sendCommunication(
            communicationId: UInt64,
            tenantId: UInt64,
            propertyId: UInt64,
            sender: Address,
            recipient: Address,
            messageType: String,
            subject: String,
            message: String,
            priority: String
        ): Bool {
            let communication = TenantCommunication(
                communicationId: communicationId,
                tenantId: tenantId,
                propertyId: propertyId,
                sender: sender,
                recipient: recipient,
                messageType: messageType,
                subject: subject,
                message: message,
                priority: priority
            )
            
            if let existingCommunications = self.communications[tenantId] {
                self.communications[tenantId] = existingCommunications.concat([communication])
            } else {
                self.communications[tenantId] = [communication]
            }
            
            return true
        }
        
        /// Mark communication as read
        access(all) fun markCommunicationAsRead(tenantId: UInt64, communicationId: UInt64): Bool {
            if let communications = self.communications[tenantId] {
                var updatedCommunications: [TenantCommunication] = []
                for comm in communications {
                    if comm.communicationId == communicationId {
                        let updatedComm = TenantCommunication(
                            communicationId: comm.communicationId,
                            tenantId: comm.tenantId,
                            propertyId: comm.propertyId,
                            sender: comm.sender,
                            recipient: comm.recipient,
                            messageType: comm.messageType,
                            subject: comm.subject,
                            message: comm.message,
                            priority: comm.priority
                        )
                        updatedComm.isRead = true
                        updatedCommunications.append(updatedComm)
                    } else {
                        updatedCommunications.append(comm)
                    }
                }
                self.communications[tenantId] = updatedCommunications
                return true
            }
            return false
        }
        
        /// Get tenant profile
        access(all) fun getTenantProfile(tenantId: UInt64): TenantProfile? {
            return self.tenants[tenantId]
        }
        
        /// Get lease agreement
        access(all) fun getLeaseAgreement(leaseId: UInt64): LeaseAgreement? {
            return self.leases[leaseId]
        }
        
        /// Get tenant communications
        access(all) fun getTenantCommunications(tenantId: UInt64): [TenantCommunication] {
            return self.communications[tenantId] ?? []
        }
        
        /// Get tenant payment history (mock implementation)
        access(all) fun getTenantPaymentHistory(tenantId: UInt64): [PropertyManagementContract.PaymentRecord] {
            // This would integrate with PropertyManagementContract
            // For now, return empty array
            return []
        }
        
        /// Get tenant lease history
        access(all) fun getTenantLeaseHistory(tenantId: UInt64): [LeaseAgreement] {
            let tenantLeases: [LeaseAgreement] = []
            for lease in self.leases.values {
                if lease.tenantId == tenantId {
                    tenantLeases.append(lease)
                }
            }
            return tenantLeases
        }
        
        /// Get all tenants for owner
        access(all) fun getAllTenants(): [TenantProfile] {
            let tenants: [TenantProfile] = []
            for tenant in self.tenants.values {
                tenants.append(tenant)
            }
            return tenants
        }
        
        /// Get all leases for owner
        access(all) fun getAllLeases(): [LeaseAgreement] {
            let leases: [LeaseAgreement] = []
            for lease in self.leases.values {
                leases.append(lease)
            }
            return leases
        }
        
        /// Get tenants by property
        access(all) fun getTenantsByProperty(propertyId: UInt64): [TenantProfile] {
            let tenants: [TenantProfile] = []
            if let tenantIds = self.propertyTenants[propertyId] {
                for tenantId in tenantIds {
                    if let tenant = self.tenants[tenantId] {
                        tenants.append(tenant)
                    }
                }
            }
            return tenants
        }
        
        /// Get properties by tenant
        access(all) fun getPropertiesByTenant(tenantId: UInt64): [UInt64] {
            return self.tenantProperties[tenantId] ?? []
        }
    }
    
    // ===== STORAGE AND EVENTS =====
    
    /// Storage for tenant registry managers
    access(all) let tenantRegistryManagers: {Address: TenantRegistryManager}
    
    /// Events
    access(all) event TenantRegistered(tenantId: UInt64, address: Address, name: String)
    access(all) event VerificationUpdated(tenantId: UInt64, verificationStatus: String, kycStatus: String, amlStatus: String)
    access(all) event LeaseCreated(leaseId: UInt64, tenantId: UInt64, propertyId: UInt64)
    access(all) event LeaseSigned(leaseId: UInt64, signedAt: UInt64)
    access(all) event LeaseTerminated(leaseId: UInt64, terminationReason: String)
    access(all) event CommunicationSent(communicationId: UInt64, tenantId: UInt64, messageType: String)
    
    // ===== INITIALIZATION =====
    
    init() {
        self.tenantRegistryManagers = {}
    }
    
    // ===== PUBLIC FUNCTIONS =====
    
    /// Create a new tenant registry manager resource
    access(all) fun createTenantRegistryManager(): @TenantRegistryManager {
        let manager = TenantRegistryManager(owner: self.owner?.address ?? panic("No owner"))
        return <-manager
    }
    
    /// Register a new tenant
    access(all) fun registerTenant(
        tenantId: UInt64,
        address: Address,
        name: String,
        email: String,
        phone: String,
        dateOfBirth: UInt64,
        ssn: String,
        employmentInfo: EmploymentInfo,
        creditScore: UInt32,
        income: UFix64,
        references: [Reference]
    ): Bool {
        if let tenantRegistryManager = self.tenantRegistryManagers[self.owner?.address] {
            let success = tenantRegistryManager.registerTenant(
                tenantId: tenantId,
                address: address,
                name: name,
                email: email,
                phone: phone,
                dateOfBirth: dateOfBirth,
                ssn: ssn,
                employmentInfo: employmentInfo,
                creditScore: creditScore,
                income: income,
                references: references
            )
            if success {
                emit TenantRegistered(tenantId: tenantId, address: address, name: name)
            }
            return success
        }
        return false
    }
    
    /// Update tenant verification status
    access(all) fun updateVerificationStatus(
        tenantId: UInt64,
        verificationStatus: String,
        kycStatus: String,
        amlStatus: String
    ): Bool {
        if let tenantRegistryManager = self.tenantRegistryManagers[self.owner?.address] {
            let success = tenantRegistryManager.updateVerificationStatus(
                tenantId: tenantId,
                verificationStatus: verificationStatus,
                kycStatus: kycStatus,
                amlStatus: amlStatus
            )
            if success {
                emit VerificationUpdated(tenantId: tenantId, verificationStatus: verificationStatus, kycStatus: kycStatus, amlStatus: amlStatus)
            }
            return success
        }
        return false
    }
    
    /// Create lease agreement
    access(all) fun createLeaseAgreement(
        leaseId: UInt64,
        tenantId: UInt64,
        propertyId: UInt64,
        landlordAddress: Address,
        startDate: UInt64,
        endDate: UInt64,
        monthlyRent: UFix64,
        securityDeposit: UFix64,
        petDeposit: UFix64,
        lateFee: UFix64,
        leaseTerms: {String: String}
    ): Bool {
        if let tenantRegistryManager = self.tenantRegistryManagers[self.owner?.address] {
            let success = tenantRegistryManager.createLeaseAgreement(
                leaseId: leaseId,
                tenantId: tenantId,
                propertyId: propertyId,
                landlordAddress: landlordAddress,
                startDate: startDate,
                endDate: endDate,
                monthlyRent: monthlyRent,
                securityDeposit: securityDeposit,
                petDeposit: petDeposit,
                lateFee: lateFee,
                leaseTerms: leaseTerms
            )
            if success {
                emit LeaseCreated(leaseId: leaseId, tenantId: tenantId, propertyId: propertyId)
            }
            return success
        }
        return false
    }
    
    /// Sign lease agreement
    access(all) fun signLeaseAgreement(leaseId: UInt64): Bool {
        if let tenantRegistryManager = self.tenantRegistryManagers[self.owner?.address] {
            let success = tenantRegistryManager.signLeaseAgreement(leaseId: leaseId)
            if success {
                emit LeaseSigned(leaseId: leaseId, signedAt: getCurrentBlock().timestamp)
            }
            return success
        }
        return false
    }
    
    /// Terminate lease agreement
    access(all) fun terminateLeaseAgreement(
        leaseId: UInt64,
        terminationReason: String
    ): Bool {
        if let tenantRegistryManager = self.tenantRegistryManagers[self.owner?.address] {
            let success = tenantRegistryManager.terminateLeaseAgreement(
                leaseId: leaseId,
                terminationReason: terminationReason
            )
            if success {
                emit LeaseTerminated(leaseId: leaseId, terminationReason: terminationReason)
            }
            return success
        }
        return false
    }
    
    /// Send communication to tenant
    access(all) fun sendCommunication(
        communicationId: UInt64,
        tenantId: UInt64,
        propertyId: UInt64,
        sender: Address,
        recipient: Address,
        messageType: String,
        subject: String,
        message: String,
        priority: String
    ): Bool {
        if let tenantRegistryManager = self.tenantRegistryManagers[self.owner?.address] {
            let success = tenantRegistryManager.sendCommunication(
                communicationId: communicationId,
                tenantId: tenantId,
                propertyId: propertyId,
                sender: sender,
                recipient: recipient,
                messageType: messageType,
                subject: subject,
                message: message,
                priority: priority
            )
            if success {
                emit CommunicationSent(communicationId: communicationId, tenantId: tenantId, messageType: messageType)
            }
            return success
        }
        return false
    }
    
    /// Get tenant profile
    access(all) fun getTenantProfile(tenantId: UInt64): TenantProfile? {
        if let tenantRegistryManager = self.tenantRegistryManagers[self.owner?.address] {
            return tenantRegistryManager.getTenantProfile(tenantId: tenantId)
        }
        return nil
    }
    
    /// Get lease agreement
    access(all) fun getLeaseAgreement(leaseId: UInt64): LeaseAgreement? {
        if let tenantRegistryManager = self.tenantRegistryManagers[self.owner?.address] {
            return tenantRegistryManager.getLeaseAgreement(leaseId: leaseId)
        }
        return nil
    }
    
    /// Get tenant communications
    access(all) fun getTenantCommunications(tenantId: UInt64): [TenantCommunication] {
        if let tenantRegistryManager = self.tenantRegistryManagers[self.owner?.address] {
            return tenantRegistryManager.getTenantCommunications(tenantId: tenantId)
        }
        return []
    }
    
    /// Get all tenants for owner
    access(all) fun getAllTenants(): [TenantProfile] {
        if let tenantRegistryManager = self.tenantRegistryManagers[self.owner?.address] {
            return tenantRegistryManager.getAllTenants()
        }
        return []
    }
    
    /// Get all leases for owner
    access(all) fun getAllLeases(): [LeaseAgreement] {
        if let tenantRegistryManager = self.tenantRegistryManagers[self.owner?.address] {
            return tenantRegistryManager.getAllLeases()
        }
        return []
    }
    
    /// Store tenant registry manager resource
    access(all) fun storeTenantRegistryManager(manager: @TenantRegistryManager) {
        let manager = <-manager
        self.tenantRegistryManagers[manager.owner] = manager
    }
    
    /// Get tenant registry manager resource
    access(all) fun getTenantRegistryManager(): @TenantRegistryManager? {
        if let manager = self.tenantRegistryManagers[self.owner?.address] {
            return <-manager
        }
        return nil
    }
}

