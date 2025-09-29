import "FungibleToken"
import "FlowToken"
import "PropertyManagementContract"

/// Automation Engine Contract for automated property management tasks
/// Handles automated rent collection, maintenance scheduling, and property operations
access(all) contract AutomationEngine {
    
    // ===== STRUCTS AND RESOURCES =====
    
    /// Automation task structure
    access(all) struct AutomationTask {
        pub let taskId: UInt64
        pub let taskType: String
        pub let propertyId: UInt64
        pub let owner: Address
        pub let schedule: AutomationSchedule
        pub let isActive: Bool
        pub let lastExecuted: UInt64?
        pub let nextExecution: UInt64
        pub let executionCount: UInt32
        pub let successCount: UInt32
        pub let failureCount: UInt32
        pub let parameters: {String: String}
        
        init(
            taskId: UInt64,
            taskType: String,
            propertyId: UInt64,
            owner: Address,
            schedule: AutomationSchedule,
            parameters: {String: String}
        ) {
            self.taskId = taskId
            self.taskType = taskType
            self.propertyId = propertyId
            self.owner = owner
            self.schedule = schedule
            self.isActive = true
            self.lastExecuted = nil
            self.nextExecution = schedule.calculateNextExecution(getCurrentBlock().timestamp)
            self.executionCount = 0
            self.successCount = 0
            self.failureCount = 0
            self.parameters = parameters
        }
    }
    
    /// Automation schedule structure
    access(all) struct AutomationSchedule {
        pub let scheduleType: String // "DAILY", "WEEKLY", "MONTHLY", "CUSTOM"
        pub let interval: UInt64 // seconds
        pub let startTime: UInt64
        pub let endTime: UInt64?
        pub let timezone: String
        pub let customSchedule: {String: String}?
        
        init(
            scheduleType: String,
            interval: UInt64,
            startTime: UInt64,
            endTime: UInt64?,
            timezone: String,
            customSchedule: {String: String}?
        ) {
            self.scheduleType = scheduleType
            self.interval = interval
            self.startTime = startTime
            self.endTime = endTime
            self.timezone = timezone
            self.customSchedule = customSchedule
        }
        
        /// Calculate next execution time
        access(all) fun calculateNextExecution(currentTime: UInt64): UInt64 {
            if currentTime < self.startTime {
                return self.startTime
            }
            
            if let endTime = self.endTime, currentTime >= endTime {
                return endTime
            }
            
            let elapsed = currentTime - self.startTime
            let intervals = elapsed / self.interval
            return self.startTime + ((intervals + 1) * self.interval)
        }
    }
    
    /// Automation result structure
    access(all) struct AutomationResult {
        pub let taskId: UInt64
        pub let executionTime: UInt64
        pub let success: Bool
        pub let message: String
        pub let data: {String: String}
        pub let gasUsed: UInt64
        pub let executionDuration: UInt64
        
        init(
            taskId: UInt64,
            executionTime: UInt64,
            success: Bool,
            message: String,
            data: {String: String},
            gasUsed: UInt64,
            executionDuration: UInt64
        ) {
            self.taskId = taskId
            self.executionTime = executionTime
            self.success = success
            self.message = message
            self.data = data
            self.gasUsed = gasUsed
            self.executionDuration = executionDuration
        }
    }
    
    /// Automation engine resource for property owners
    access(all) resource AutomationManager {
        pub let owner: Address
        pub var tasks: {UInt64: AutomationTask}
        pub var results: {UInt64: [AutomationResult]}
        pub var isEnabled: Bool
        pub var maxTasksPerOwner: UInt32
        pub var executionHistory: [AutomationResult]
        
        init(owner: Address) {
            self.owner = owner
            self.tasks = {}
            self.results = {}
            self.isEnabled = true
            self.maxTasksPerOwner = 50
            self.executionHistory = []
        }
        
        /// Create a new automation task
        access(all) fun createTask(
            taskId: UInt64,
            taskType: String,
            propertyId: UInt64,
            schedule: AutomationSchedule,
            parameters: {String: String}
        ): Bool {
            if self.tasks.length >= self.maxTasksPerOwner {
                return false
            }
            
            let task = AutomationTask(
                taskId: taskId,
                taskType: taskType,
                propertyId: propertyId,
                owner: self.owner,
                schedule: schedule,
                parameters: parameters
            )
            self.tasks[taskId] = task
            self.results[taskId] = []
            return true
        }
        
        /// Update task schedule
        access(all) fun updateTaskSchedule(
            taskId: UInt64,
            newSchedule: AutomationSchedule
        ): Bool {
            if let task = self.tasks[taskId] {
                let updatedTask = AutomationTask(
                    taskId: task.taskId,
                    taskType: task.taskType,
                    propertyId: task.propertyId,
                    owner: task.owner,
                    schedule: newSchedule,
                    parameters: task.parameters
                )
                updatedTask.isActive = task.isActive
                updatedTask.lastExecuted = task.lastExecuted
                updatedTask.nextExecution = newSchedule.calculateNextExecution(getCurrentBlock().timestamp)
                updatedTask.executionCount = task.executionCount
                updatedTask.successCount = task.successCount
                updatedTask.failureCount = task.failureCount
                self.tasks[taskId] = updatedTask
                return true
            }
            return false
        }
        
        /// Enable or disable a task
        access(all) fun toggleTask(taskId: UInt64, isActive: Bool): Bool {
            if let task = self.tasks[taskId] {
                let updatedTask = AutomationTask(
                    taskId: task.taskId,
                    taskType: task.taskType,
                    propertyId: task.propertyId,
                    owner: task.owner,
                    schedule: task.schedule,
                    parameters: task.parameters
                )
                updatedTask.isActive = isActive
                updatedTask.lastExecuted = task.lastExecuted
                updatedTask.nextExecution = task.nextExecution
                updatedTask.executionCount = task.executionCount
                updatedTask.successCount = task.successCount
                updatedTask.failureCount = task.failureCount
                self.tasks[taskId] = updatedTask
                return true
            }
            return false
        }
        
        /// Execute a specific task
        access(all) fun executeTask(taskId: UInt64): AutomationResult {
            let startTime = getCurrentBlock().timestamp
            let startGas = getCurrentBlock().height
            
            if let task = self.tasks[taskId] {
                if !task.isActive {
                    let result = AutomationResult(
                        taskId: taskId,
                        executionTime: startTime,
                        success: false,
                        message: "Task is disabled",
                        data: {},
                        gasUsed: 0,
                        executionDuration: 0
                    )
                    self.addExecutionResult(taskId: taskId, result: result)
                    return result
                }
                
                let currentTime = getCurrentBlock().timestamp
                if currentTime < task.nextExecution {
                    let result = AutomationResult(
                        taskId: taskId,
                        executionTime: startTime,
                        success: false,
                        message: "Task not ready for execution",
                        data: {},
                        gasUsed: 0,
                        executionDuration: 0
                    )
                    self.addExecutionResult(taskId: taskId, result: result)
                    return result
                }
                
                // Execute task based on type
                let executionResult = self.executeTaskByType(task: task)
                
                // Update task execution info
                let updatedTask = AutomationTask(
                    taskId: task.taskId,
                    taskType: task.taskType,
                    propertyId: task.propertyId,
                    owner: task.owner,
                    schedule: task.schedule,
                    parameters: task.parameters
                )
                updatedTask.isActive = task.isActive
                updatedTask.lastExecuted = startTime
                updatedTask.nextExecution = task.schedule.calculateNextExecution(currentTime)
                updatedTask.executionCount = task.executionCount + 1
                if executionResult.success {
                    updatedTask.successCount = task.successCount + 1
                } else {
                    updatedTask.failureCount = task.failureCount + 1
                }
                self.tasks[taskId] = updatedTask
                
                self.addExecutionResult(taskId: taskId, result: executionResult)
                return executionResult
            }
            
            let result = AutomationResult(
                taskId: taskId,
                executionTime: startTime,
                success: false,
                message: "Task not found",
                data: {},
                gasUsed: 0,
                executionDuration: 0
            )
            return result
        }
        
        /// Execute task based on type
        access(all) fun executeTaskByType(task: AutomationTask): AutomationResult {
            let startTime = getCurrentBlock().timestamp
            
            switch task.taskType {
                case "RENT_COLLECTION":
                    return self.executeRentCollection(task: task)
                case "MAINTENANCE_REMINDER":
                    return self.executeMaintenanceReminder(task: task)
                case "LEASE_RENEWAL":
                    return self.executeLeaseRenewal(task: task)
                case "PROPERTY_INSPECTION":
                    return self.executePropertyInspection(task: task)
                case "UTILITY_PAYMENT":
                    return self.executeUtilityPayment(task: task)
                case "MARKET_ANALYSIS":
                    return self.executeMarketAnalysis(task: task)
                default:
                    return AutomationResult(
                        taskId: task.taskId,
                        executionTime: startTime,
                        success: false,
                        message: "Unknown task type",
                        data: {},
                        gasUsed: 0,
                        executionDuration: getCurrentBlock().timestamp - startTime
                    )
            }
        }
        
        /// Execute rent collection automation
        access(all) fun executeRentCollection(task: AutomationTask): AutomationResult {
            let startTime = getCurrentBlock().timestamp
            
            // This would integrate with PropertyManagementContract
            // For now, we'll simulate the execution
            let success = true
            let message = "Rent collection executed successfully"
            let data = {
                "propertyId": task.propertyId.toString(),
                "amount": task.parameters["amount"] ?? "0",
                "tenantCount": task.parameters["tenantCount"] ?? "0"
            }
            
            return AutomationResult(
                taskId: task.taskId,
                executionTime: startTime,
                success: success,
                message: message,
                data: data,
                gasUsed: 1000,
                executionDuration: getCurrentBlock().timestamp - startTime
            )
        }
        
        /// Execute maintenance reminder automation
        access(all) fun executeMaintenanceReminder(task: AutomationTask): AutomationResult {
            let startTime = getCurrentBlock().timestamp
            
            // Simulate maintenance reminder execution
            let success = true
            let message = "Maintenance reminder sent"
            let data = {
                "propertyId": task.propertyId.toString(),
                "reminderType": task.parameters["reminderType"] ?? "GENERAL",
                "recipients": task.parameters["recipients"] ?? "1"
            }
            
            return AutomationResult(
                taskId: task.taskId,
                executionTime: startTime,
                success: success,
                message: message,
                data: data,
                gasUsed: 500,
                executionDuration: getCurrentBlock().timestamp - startTime
            )
        }
        
        /// Execute lease renewal automation
        access(all) fun executeLeaseRenewal(task: AutomationTask): AutomationResult {
            let startTime = getCurrentBlock().timestamp
            
            // Simulate lease renewal execution
            let success = true
            let message = "Lease renewal processed"
            let data = {
                "propertyId": task.propertyId.toString(),
                "tenantId": task.parameters["tenantId"] ?? "0",
                "newEndDate": task.parameters["newEndDate"] ?? "0"
            }
            
            return AutomationResult(
                taskId: task.taskId,
                executionTime: startTime,
                success: success,
                message: message,
                data: data,
                gasUsed: 1500,
                executionDuration: getCurrentBlock().timestamp - startTime
            )
        }
        
        /// Execute property inspection automation
        access(all) fun executePropertyInspection(task: AutomationTask): AutomationResult {
            let startTime = getCurrentBlock().timestamp
            
            // Simulate property inspection execution
            let success = true
            let message = "Property inspection scheduled"
            let data = {
                "propertyId": task.propertyId.toString(),
                "inspectionType": task.parameters["inspectionType"] ?? "ROUTINE",
                "scheduledDate": task.parameters["scheduledDate"] ?? "0"
            }
            
            return AutomationResult(
                taskId: task.taskId,
                executionTime: startTime,
                success: success,
                message: message,
                data: data,
                gasUsed: 800,
                executionDuration: getCurrentBlock().timestamp - startTime
            )
        }
        
        /// Execute utility payment automation
        access(all) fun executeUtilityPayment(task: AutomationTask): AutomationResult {
            let startTime = getCurrentBlock().timestamp
            
            // Simulate utility payment execution
            let success = true
            let message = "Utility payment processed"
            let data = {
                "propertyId": task.propertyId.toString(),
                "utilityType": task.parameters["utilityType"] ?? "GENERAL",
                "amount": task.parameters["amount"] ?? "0"
            }
            
            return AutomationResult(
                taskId: task.taskId,
                executionTime: startTime,
                success: success,
                message: message,
                data: data,
                gasUsed: 1200,
                executionDuration: getCurrentBlock().timestamp - startTime
            )
        }
        
        /// Execute market analysis automation
        access(all) fun executeMarketAnalysis(task: AutomationTask): AutomationResult {
            let startTime = getCurrentBlock().timestamp
            
            // Simulate market analysis execution
            let success = true
            let message = "Market analysis completed"
            let data = {
                "propertyId": task.propertyId.toString(),
                "analysisType": task.parameters["analysisType"] ?? "COMPREHENSIVE",
                "marketValue": task.parameters["marketValue"] ?? "0"
            }
            
            return AutomationResult(
                taskId: task.taskId,
                executionTime: startTime,
                success: success,
                message: message,
                data: data,
                gasUsed: 2000,
                executionDuration: getCurrentBlock().timestamp - startTime
            )
        }
        
        /// Add execution result to history
        access(all) fun addExecutionResult(taskId: UInt64, result: AutomationResult) {
            if let existingResults = self.results[taskId] {
                self.results[taskId] = existingResults.concat([result])
            } else {
                self.results[taskId] = [result]
            }
            self.executionHistory.append(result)
        }
        
        /// Get tasks ready for execution
        access(all) fun getTasksReadyForExecution(): [AutomationTask] {
            let currentTime = getCurrentBlock().timestamp
            let readyTasks: [AutomationTask] = []
            
            for task in self.tasks.values {
                if task.isActive && currentTime >= task.nextExecution {
                    readyTasks.append(task)
                }
            }
            return readyTasks
        }
        
        /// Get task execution history
        access(all) fun getTaskExecutionHistory(taskId: UInt64): [AutomationResult] {
            return self.results[taskId] ?? []
        }
        
        /// Get all tasks for owner
        access(all) fun getAllTasks(): [AutomationTask] {
            let tasks: [AutomationTask] = []
            for task in self.tasks.values {
                tasks.append(task)
            }
            return tasks
        }
        
        /// Get automation statistics
        access(all) fun getAutomationStats(): {String: UInt32} {
            var totalTasks = 0
            var activeTasks = 0
            var totalExecutions = 0
            var successfulExecutions = 0
            var failedExecutions = 0
            
            for task in self.tasks.values {
                totalTasks = totalTasks + 1
                if task.isActive {
                    activeTasks = activeTasks + 1
                }
                totalExecutions = totalExecutions + task.executionCount
                successfulExecutions = successfulExecutions + task.successCount
                failedExecutions = failedExecutions + task.failureCount
            }
            
            return {
                "totalTasks": totalTasks,
                "activeTasks": activeTasks,
                "totalExecutions": totalExecutions,
                "successfulExecutions": successfulExecutions,
                "failedExecutions": failedExecutions
            }
        }
    }
    
    // ===== STORAGE AND EVENTS =====
    
    /// Storage for automation managers
    access(all) let automationManagers: {Address: AutomationManager}
    
    /// Events
    access(all) event TaskCreated(taskId: UInt64, taskType: String, propertyId: UInt64, owner: Address)
    access(all) event TaskExecuted(taskId: UInt64, success: Bool, message: String)
    access(all) event TaskUpdated(taskId: UInt64, updateType: String)
    access(all) event AutomationEnabled(owner: Address, enabled: Bool)
    
    // ===== INITIALIZATION =====
    
    init() {
        self.automationManagers = {}
    }
    
    // ===== PUBLIC FUNCTIONS =====
    
    /// Create a new automation manager resource
    access(all) fun createAutomationManager(): @AutomationManager {
        let manager = AutomationManager(owner: self.owner?.address ?? panic("No owner"))
        return <-manager
    }
    
    /// Create a new automation task
    access(all) fun createTask(
        taskId: UInt64,
        taskType: String,
        propertyId: UInt64,
        schedule: AutomationSchedule,
        parameters: {String: String}
    ): Bool {
        if let automationManager = self.automationManagers[self.owner?.address] {
            let success = automationManager.createTask(
                taskId: taskId,
                taskType: taskType,
                propertyId: propertyId,
                schedule: schedule,
                parameters: parameters
            )
            if success {
                emit TaskCreated(taskId: taskId, taskType: taskType, propertyId: propertyId, owner: self.owner?.address ?? panic("No owner"))
            }
            return success
        }
        return false
    }
    
    /// Execute a specific task
    access(all) fun executeTask(taskId: UInt64): AutomationResult {
        if let automationManager = self.automationManagers[self.owner?.address] {
            let result = automationManager.executeTask(taskId: taskId)
            emit TaskExecuted(taskId: taskId, success: result.success, message: result.message)
            return result
        }
        
        return AutomationResult(
            taskId: taskId,
            executionTime: getCurrentBlock().timestamp,
            success: false,
            message: "Automation manager not found",
            data: {},
            gasUsed: 0,
            executionDuration: 0
        )
    }
    
    /// Execute all ready tasks
    access(all) fun executeReadyTasks(): [AutomationResult] {
        if let automationManager = self.automationManagers[self.owner?.address] {
            let readyTasks = automationManager.getTasksReadyForExecution()
            let results: [AutomationResult] = []
            
            for task in readyTasks {
                let result = automationManager.executeTask(taskId: task.taskId)
                results.append(result)
                emit TaskExecuted(taskId: task.taskId, success: result.success, message: result.message)
            }
            
            return results
        }
        return []
    }
    
    /// Update task schedule
    access(all) fun updateTaskSchedule(
        taskId: UInt64,
        newSchedule: AutomationSchedule
    ): Bool {
        if let automationManager = self.automationManagers[self.owner?.address] {
            let success = automationManager.updateTaskSchedule(taskId: taskId, newSchedule: newSchedule)
            if success {
                emit TaskUpdated(taskId: taskId, updateType: "SCHEDULE")
            }
            return success
        }
        return false
    }
    
    /// Toggle task active status
    access(all) fun toggleTask(taskId: UInt64, isActive: Bool): Bool {
        if let automationManager = self.automationManagers[self.owner?.address] {
            let success = automationManager.toggleTask(taskId: taskId, isActive: isActive)
            if success {
                emit TaskUpdated(taskId: taskId, updateType: "STATUS")
            }
            return success
        }
        return false
    }
    
    /// Get all tasks for owner
    access(all) fun getAllTasks(): [AutomationTask] {
        if let automationManager = self.automationManagers[self.owner?.address] {
            return automationManager.getAllTasks()
        }
        return []
    }
    
    /// Get task execution history
    access(all) fun getTaskExecutionHistory(taskId: UInt64): [AutomationResult] {
        if let automationManager = self.automationManagers[self.owner?.address] {
            return automationManager.getTaskExecutionHistory(taskId: taskId)
        }
        return []
    }
    
    /// Get automation statistics
    access(all) fun getAutomationStats(): {String: UInt32} {
        if let automationManager = self.automationManagers[self.owner?.address] {
            return automationManager.getAutomationStats()
        }
        return {}
    }
    
    /// Store automation manager resource
    access(all) fun storeAutomationManager(manager: @AutomationManager) {
        let manager = <-manager
        self.automationManagers[manager.owner] = manager
    }
    
    /// Get automation manager resource
    access(all) fun getAutomationManager(): @AutomationManager? {
        if let manager = self.automationManagers[self.owner?.address] {
            return <-manager
        }
        return nil
    }
}

