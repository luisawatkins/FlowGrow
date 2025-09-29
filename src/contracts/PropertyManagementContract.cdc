import "FungibleToken"
import "NonFungibleToken"
import "PropertyNFT"
import "FlowToken"

/// Property Management Contract for automated property management
/// Handles rent collection, maintenance requests, tenant management, and property operations
access(all) contract PropertyManagementContract {
    
    // ===== STRUCTS AND RESOURCES =====
    
    /// Property management data structure
    access(all) struct PropertyManagement {
        pub let propertyId: UInt64
        pub let owner: Address
        pub let manager: Address?
        pub let rentAmount: UFix64
        pub let rentDueDate: UInt64
        pub let maintenanceFund: UFix64
        pub let isActive: Bool
        pub let createdAt: UInt64
        pub let lastRentCollection: UInt64?
        pub let tenantCount: UInt32
        pub let totalRevenue: UFix64
        pub let maintenanceRequests: [UInt64]
        
        init(
            propertyId: UInt64,
            owner: Address,
            manager: Address?,
            rentAmount: UFix64,
            rentDueDate: UInt64,
            maintenanceFund: UFix64
        ) {
            self.propertyId = propertyId
            self.owner = owner
            self.manager = manager
            self.rentAmount = rentAmount
            self.rentDueDate = rentDueDate
            self.maintenanceFund = maintenanceFund
            self.isActive = true
            self.createdAt = getCurrentBlock().timestamp
            self.lastRentCollection = nil
            self.tenantCount = 0
            self.totalRevenue = 0.0
            self.maintenanceRequests = []
        }
    }
    
    /// Tenant information structure
    access(all) struct TenantInfo {
        pub let tenantId: UInt64
        pub let propertyId: UInt64
        pub let tenantAddress: Address
        pub let leaseStartDate: UInt64
        pub let leaseEndDate: UInt64
        pub let monthlyRent: UFix64
        pub let securityDeposit: UFix64
        pub let isActive: Bool
        pub let paymentHistory: [PaymentRecord]
        pub let maintenanceRequests: [UInt64]
        
        init(
            tenantId: UInt64,
            propertyId: UInt64,
            tenantAddress: Address,
            leaseStartDate: UInt64,
            leaseEndDate: UInt64,
            monthlyRent: UFix64,
            securityDeposit: UFix64
        ) {
            self.tenantId = tenantId
            self.propertyId = propertyId
            self.tenantAddress = tenantAddress
            self.leaseStartDate = leaseStartDate
            self.leaseEndDate = leaseEndDate
            self.monthlyRent = monthlyRent
            self.securityDeposit = securityDeposit
            self.isActive = true
            self.paymentHistory = []
            self.maintenanceRequests = []
        }
    }
    
    /// Payment record structure
    access(all) struct PaymentRecord {
        pub let paymentId: UInt64
        pub let amount: UFix64
        pub let paymentDate: UInt64
        pub let paymentType: String
        pub let isLate: Bool
        pub let lateFee: UFix64
        
        init(
            paymentId: UInt64,
            amount: UFix64,
            paymentDate: UInt64,
            paymentType: String,
            isLate: Bool,
            lateFee: UFix64
        ) {
            self.paymentId = paymentId
            self.amount = amount
            self.paymentDate = paymentDate
            self.paymentType = paymentType
            self.isLate = isLate
            self.lateFee = lateFee
        }
    }
    
    /// Maintenance request structure
    access(all) struct MaintenanceRequest {
        pub let requestId: UInt64
        pub let propertyId: UInt64
        pub let tenantId: UInt64?
        pub let description: String
        pub let priority: String
        pub let estimatedCost: UFix64
        pub let status: String
        pub let createdAt: UInt64
        pub let completedAt: UInt64?
        pub let assignedVendor: Address?
        pub let actualCost: UFix64?
        
        init(
            requestId: UInt64,
            propertyId: UInt64,
            tenantId: UInt64?,
            description: String,
            priority: String,
            estimatedCost: UFix64
        ) {
            self.requestId = requestId
            self.propertyId = propertyId
            self.tenantId = tenantId
            self.description = description
            self.priority = priority
            self.estimatedCost = estimatedCost
            self.status = "PENDING"
            self.createdAt = getCurrentBlock().timestamp
            self.completedAt = nil
            self.assignedVendor = nil
            self.actualCost = nil
        }
    }
    
    /// Property management resource for property owners
    access(all) resource PropertyManager {
        pub let owner: Address
        pub var properties: {UInt64: PropertyManagement}
        pub var tenants: {UInt64: TenantInfo}
        pub var maintenanceRequests: {UInt64: MaintenanceRequest}
        pub var totalRevenue: UFix64
        pub var totalMaintenanceCost: UFix64
        
        init(owner: Address) {
            self.owner = owner
            self.properties = {}
            self.tenants = {}
            self.maintenanceRequests = {}
            self.totalRevenue = 0.0
            self.totalMaintenanceCost = 0.0
        }
        
        /// Add a property to management
        access(all) fun addProperty(
            propertyId: UInt64,
            manager: Address?,
            rentAmount: UFix64,
            rentDueDate: UInt64,
            maintenanceFund: UFix64
        ) {
            let propertyManagement = PropertyManagement(
                propertyId: propertyId,
                owner: self.owner,
                manager: manager,
                rentAmount: rentAmount,
                rentDueDate: rentDueDate,
                maintenanceFund: maintenanceFund
            )
            self.properties[propertyId] = propertyManagement
        }
        
        /// Add a tenant to a property
        access(all) fun addTenant(
            tenantId: UInt64,
            propertyId: UInt64,
            tenantAddress: Address,
            leaseStartDate: UInt64,
            leaseEndDate: UInt64,
            monthlyRent: UFix64,
            securityDeposit: UFix64
        ) {
            let tenantInfo = TenantInfo(
                tenantId: tenantId,
                propertyId: propertyId,
                tenantAddress: tenantAddress,
                leaseStartDate: leaseStartDate,
                leaseEndDate: leaseEndDate,
                monthlyRent: monthlyRent,
                securityDeposit: securityDeposit
            )
            self.tenants[tenantId] = tenantInfo
            
            // Update property tenant count
            if let property = self.properties[propertyId] {
                let updatedProperty = PropertyManagement(
                    propertyId: property.propertyId,
                    owner: property.owner,
                    manager: property.manager,
                    rentAmount: property.rentAmount,
                    rentDueDate: property.rentDueDate,
                    maintenanceFund: property.maintenanceFund
                )
                updatedProperty.tenantCount = property.tenantCount + 1
                self.properties[propertyId] = updatedProperty
            }
        }
        
        /// Process rent payment
        access(all) fun processRentPayment(
            tenantId: UInt64,
            amount: UFix64,
            paymentType: String
        ): Bool {
            if let tenant = self.tenants[tenantId] {
                let currentTime = getCurrentBlock().timestamp
                let isLate = currentTime > tenant.leaseStartDate + (30 * 24 * 60 * 60) // 30 days
                let lateFee: UFix64 = if isLate { amount * 0.05 } else { 0.0 }
                
                let paymentRecord = PaymentRecord(
                    paymentId: getCurrentBlock().height,
                    amount: amount,
                    paymentDate: currentTime,
                    paymentType: paymentType,
                    isLate: isLate,
                    lateFee: lateFee
                )
                
                // Update tenant payment history
                let updatedTenant = TenantInfo(
                    tenantId: tenant.tenantId,
                    propertyId: tenant.propertyId,
                    tenantAddress: tenant.tenantAddress,
                    leaseStartDate: tenant.leaseStartDate,
                    leaseEndDate: tenant.leaseEndDate,
                    monthlyRent: tenant.monthlyRent,
                    securityDeposit: tenant.securityDeposit
                )
                updatedTenant.paymentHistory = tenant.paymentHistory.concat([paymentRecord])
                self.tenants[tenantId] = updatedTenant
                
                // Update property revenue
                if let property = self.properties[tenant.propertyId] {
                    let updatedProperty = PropertyManagement(
                        propertyId: property.propertyId,
                        owner: property.owner,
                        manager: property.manager,
                        rentAmount: property.rentAmount,
                        rentDueDate: property.rentDueDate,
                        maintenanceFund: property.maintenanceFund
                    )
                    updatedProperty.totalRevenue = property.totalRevenue + amount + lateFee
                    updatedProperty.lastRentCollection = currentTime
                    self.properties[tenant.propertyId] = updatedProperty
                }
                
                self.totalRevenue = self.totalRevenue + amount + lateFee
                return true
            }
            return false
        }
        
        /// Create maintenance request
        access(all) fun createMaintenanceRequest(
            requestId: UInt64,
            propertyId: UInt64,
            tenantId: UInt64?,
            description: String,
            priority: String,
            estimatedCost: UFix64
        ) {
            let maintenanceRequest = MaintenanceRequest(
                requestId: requestId,
                propertyId: propertyId,
                tenantId: tenantId,
                description: description,
                priority: priority,
                estimatedCost: estimatedCost
            )
            self.maintenanceRequests[requestId] = maintenanceRequest
            
            // Add to property maintenance requests
            if let property = self.properties[propertyId] {
                let updatedProperty = PropertyManagement(
                    propertyId: property.propertyId,
                    owner: property.owner,
                    manager: property.manager,
                    rentAmount: property.rentAmount,
                    rentDueDate: property.rentDueDate,
                    maintenanceFund: property.maintenanceFund
                )
                updatedProperty.maintenanceRequests = property.maintenanceRequests.concat([requestId])
                self.properties[propertyId] = updatedProperty
            }
        }
        
        /// Update maintenance request status
        access(all) fun updateMaintenanceRequest(
            requestId: UInt64,
            status: String,
            assignedVendor: Address?,
            actualCost: UFix64?
        ) {
            if let request = self.maintenanceRequests[requestId] {
                let updatedRequest = MaintenanceRequest(
                    requestId: request.requestId,
                    propertyId: request.propertyId,
                    tenantId: request.tenantId,
                    description: request.description,
                    priority: request.priority,
                    estimatedCost: request.estimatedCost
                )
                updatedRequest.status = status
                updatedRequest.assignedVendor = assignedVendor
                updatedRequest.actualCost = actualCost
                if status == "COMPLETED" {
                    updatedRequest.completedAt = getCurrentBlock().timestamp
                }
                self.maintenanceRequests[requestId] = updatedRequest
                
                // Update total maintenance cost
                if let cost = actualCost {
                    self.totalMaintenanceCost = self.totalMaintenanceCost + cost
                }
            }
        }
        
        /// Get property management info
        access(all) fun getPropertyInfo(propertyId: UInt64): PropertyManagement? {
            return self.properties[propertyId]
        }
        
        /// Get tenant info
        access(all) fun getTenantInfo(tenantId: UInt64): TenantInfo? {
            return self.tenants[tenantId]
        }
        
        /// Get maintenance request
        access(all) fun getMaintenanceRequest(requestId: UInt64): MaintenanceRequest? {
            return self.maintenanceRequests[requestId]
        }
        
        /// Get all properties for owner
        access(all) fun getAllProperties(): [PropertyManagement] {
            let properties: [PropertyManagement] = []
            for property in self.properties.values {
                properties.append(property)
            }
            return properties
        }
        
        /// Get all tenants for owner
        access(all) fun getAllTenants(): [TenantInfo] {
            let tenants: [TenantInfo] = []
            for tenant in self.tenants.values {
                tenants.append(tenant)
            }
            return tenants
        }
        
        /// Get all maintenance requests for owner
        access(all) fun getAllMaintenanceRequests(): [MaintenanceRequest] {
            let requests: [MaintenanceRequest] = []
            for request in self.maintenanceRequests.values {
                requests.append(request)
            }
            return requests
        }
        
        /// Calculate property performance metrics
        access(all) fun getPropertyPerformance(propertyId: UInt64): {String: UFix64} {
            if let property = self.properties[propertyId] {
                let occupancyRate = UFix64(property.tenantCount) / UFix64(1) * 100.0 // Assuming max 1 tenant per property
                let revenuePerMonth = property.totalRevenue / UFix64((getCurrentBlock().timestamp - property.createdAt) / (30 * 24 * 60 * 60))
                let maintenanceRatio = self.totalMaintenanceCost / property.totalRevenue
                
                return {
                    "occupancyRate": occupancyRate,
                    "revenuePerMonth": revenuePerMonth,
                    "maintenanceRatio": maintenanceRatio,
                    "totalRevenue": property.totalRevenue,
                    "maintenanceCost": self.totalMaintenanceCost
                }
            }
            return {}
        }
    }
    
    // ===== STORAGE AND EVENTS =====
    
    /// Storage for property managers
    access(all) let propertyManagers: {Address: PropertyManager}
    
    /// Events
    access(all) event PropertyAdded(propertyId: UInt64, owner: Address, manager: Address?)
    access(all) event TenantAdded(tenantId: UInt64, propertyId: UInt64, tenantAddress: Address)
    access(all) event RentPaymentProcessed(tenantId: UInt64, amount: UFix64, isLate: Bool)
    access(all) event MaintenanceRequestCreated(requestId: UInt64, propertyId: UInt64, priority: String)
    access(all) event MaintenanceRequestUpdated(requestId: UInt64, status: String, actualCost: UFix64?)
    
    // ===== INITIALIZATION =====
    
    init() {
        self.propertyManagers = {}
    }
    
    // ===== PUBLIC FUNCTIONS =====
    
    /// Create a new property manager resource
    access(all) fun createPropertyManager(): @PropertyManager {
        let manager = PropertyManager(owner: self.owner?.address ?? panic("No owner"))
        return <-manager
    }
    
    /// Register a property for management
    access(all) fun registerProperty(
        propertyId: UInt64,
        manager: Address?,
        rentAmount: UFix64,
        rentDueDate: UInt64,
        maintenanceFund: UFix64
    ) {
        if let propertyManager = self.propertyManagers[self.owner?.address] {
            propertyManager.addProperty(
                propertyId: propertyId,
                manager: manager,
                rentAmount: rentAmount,
                rentDueDate: rentDueDate,
                maintenanceFund: maintenanceFund
            )
            emit PropertyAdded(propertyId: propertyId, owner: self.owner?.address ?? panic("No owner"), manager: manager)
        }
    }
    
    /// Add a tenant to a property
    access(all) fun addTenant(
        tenantId: UInt64,
        propertyId: UInt64,
        tenantAddress: Address,
        leaseStartDate: UInt64,
        leaseEndDate: UInt64,
        monthlyRent: UFix64,
        securityDeposit: UFix64
    ) {
        if let propertyManager = self.propertyManagers[self.owner?.address] {
            propertyManager.addTenant(
                tenantId: tenantId,
                propertyId: propertyId,
                tenantAddress: tenantAddress,
                leaseStartDate: leaseStartDate,
                leaseEndDate: leaseEndDate,
                monthlyRent: monthlyRent,
                securityDeposit: securityDeposit
            )
            emit TenantAdded(tenantId: tenantId, propertyId: propertyId, tenantAddress: tenantAddress)
        }
    }
    
    /// Process rent payment
    access(all) fun processRentPayment(
        tenantId: UInt64,
        amount: UFix64,
        paymentType: String
    ): Bool {
        if let propertyManager = self.propertyManagers[self.owner?.address] {
            let success = propertyManager.processRentPayment(
                tenantId: tenantId,
                amount: amount,
                paymentType: paymentType
            )
            if success {
                emit RentPaymentProcessed(tenantId: tenantId, amount: amount, isLate: false)
            }
            return success
        }
        return false
    }
    
    /// Create maintenance request
    access(all) fun createMaintenanceRequest(
        requestId: UInt64,
        propertyId: UInt64,
        tenantId: UInt64?,
        description: String,
        priority: String,
        estimatedCost: UFix64
    ) {
        if let propertyManager = self.propertyManagers[self.owner?.address] {
            propertyManager.createMaintenanceRequest(
                requestId: requestId,
                propertyId: propertyId,
                tenantId: tenantId,
                description: description,
                priority: priority,
                estimatedCost: estimatedCost
            )
            emit MaintenanceRequestCreated(requestId: requestId, propertyId: propertyId, priority: priority)
        }
    }
    
    /// Update maintenance request
    access(all) fun updateMaintenanceRequest(
        requestId: UInt64,
        status: String,
        assignedVendor: Address?,
        actualCost: UFix64?
    ) {
        if let propertyManager = self.propertyManagers[self.owner?.address] {
            propertyManager.updateMaintenanceRequest(
                requestId: requestId,
                status: status,
                assignedVendor: assignedVendor,
                actualCost: actualCost
            )
            emit MaintenanceRequestUpdated(requestId: requestId, status: status, actualCost: actualCost)
        }
    }
    
    /// Get property management info
    access(all) fun getPropertyInfo(propertyId: UInt64): PropertyManagement? {
        if let propertyManager = self.propertyManagers[self.owner?.address] {
            return propertyManager.getPropertyInfo(propertyId: propertyId)
        }
        return nil
    }
    
    /// Get tenant info
    access(all) fun getTenantInfo(tenantId: UInt64): TenantInfo? {
        if let propertyManager = self.propertyManagers[self.owner?.address] {
            return propertyManager.getTenantInfo(tenantId: tenantId)
        }
        return nil
    }
    
    /// Get maintenance request
    access(all) fun getMaintenanceRequest(requestId: UInt64): MaintenanceRequest? {
        if let propertyManager = self.propertyManagers[self.owner?.address] {
            return propertyManager.getMaintenanceRequest(requestId: requestId)
        }
        return nil
    }
    
    /// Get all properties for owner
    access(all) fun getAllProperties(): [PropertyManagement] {
        if let propertyManager = self.propertyManagers[self.owner?.address] {
            return propertyManager.getAllProperties()
        }
        return []
    }
    
    /// Get all tenants for owner
    access(all) fun getAllTenants(): [TenantInfo] {
        if let propertyManager = self.propertyManagers[self.owner?.address] {
            return propertyManager.getAllTenants()
        }
        return []
    }
    
    /// Get all maintenance requests for owner
    access(all) fun getAllMaintenanceRequests(): [MaintenanceRequest] {
        if let propertyManager = self.propertyManagers[self.owner?.address] {
            return propertyManager.getAllMaintenanceRequests()
        }
        return []
    }
    
    /// Get property performance metrics
    access(all) fun getPropertyPerformance(propertyId: UInt64): {String: UFix64} {
        if let propertyManager = self.propertyManagers[self.owner?.address] {
            return propertyManager.getPropertyPerformance(propertyId: propertyId)
        }
        return {}
    }
    
    /// Store property manager resource
    access(all) fun storePropertyManager(manager: @PropertyManager) {
        let manager = <-manager
        self.propertyManagers[manager.owner] = manager
    }
    
    /// Get property manager resource
    access(all) fun getPropertyManager(): @PropertyManager? {
        if let manager = self.propertyManagers[self.owner?.address] {
            return <-manager
        }
        return nil
    }
}

