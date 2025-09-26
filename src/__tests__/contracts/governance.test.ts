import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock Flow SDK for testing
const mockFlowSDK = {
    sendTransaction: jest.fn(),
    executeScript: jest.fn(),
    getAccount: jest.fn(),
    getLatestBlock: jest.fn(),
    getTransactionStatus: jest.fn(),
    getTransactionResult: jest.fn(),
};

// Mock contract addresses
const MOCK_CONTRACT_ADDRESSES = {
    StakeholderRegistry: '0x1234567890abcdef',
    GovernanceContract: '0x1234567890abcdef',
    PropertyNFT: '0x1234567890abcdef',
    PropertyMarketplace: '0x1234567890abcdef',
};

// Mock data structures
const mockStakeholderProfile = {
    address: '0x1234567890abcdef',
    name: 'Test User',
    email: 'test@example.com',
    organization: 'Test Organization',
    status: 'Active',
    verificationLevel: 'Verified',
    votingPower: 100.0,
    propertyCount: 2,
    totalPropertyValue: 1000.0,
    reputationScore: 50.0,
    joinedAt: 1640995200.0,
    lastActiveAt: 1640995200.0,
    verificationDate: 1640995200.0,
    kycCompleted: true,
    amlCompleted: true,
};

const mockProposal = {
    id: 1,
    title: 'Test Proposal',
    description: 'This is a test proposal for governance testing',
    proposer: '0x1234567890abcdef',
    proposalType: 'PropertyRule',
    status: 'Active',
    createdAt: 1640995200.0,
    votingStartTime: 1640995200.0,
    votingEndTime: 1641081600.0,
    executionTime: null,
    yesVotes: 0.0,
    noVotes: 0.0,
    abstainVotes: 0.0,
    totalVotingPower: 1000.0,
    quorumRequired: 10.0,
    executionData: null,
    targetContract: null,
};

const mockVote = {
    proposalID: 1,
    voter: '0x1234567890abcdef',
    voteType: 'Yes',
    votingPower: 100.0,
    timestamp: 1640995200.0,
};

describe('Governance Contracts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('StakeholderRegistry Contract', () => {
        it('should register a new stakeholder', async () => {
            const registrationData = {
                address: '0x1234567890abcdef',
                name: 'Test User',
                email: 'test@example.com',
                organization: 'Test Organization',
            };

            mockFlowSDK.sendTransaction.mockResolvedValue({
                id: 'test-transaction-id',
                status: 'SEALED',
            });

            const result = await mockFlowSDK.sendTransaction({
                script: `
                    import StakeholderRegistry from ${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry}
                    
                    transaction {
                        prepare(acct: AuthAccount) {
                            let registry = acct.getAccount(${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry})
                                .getCapability<&StakeholderRegistry.RegistryCollection>(/public/StakeholderRegistry)
                                .borrow() ?? panic("Could not borrow StakeholderRegistry")
                            
                            let success = registry.registerStakeholder(
                                address: acct.address,
                                name: "${registrationData.name}",
                                email: "${registrationData.email}",
                                organization: "${registrationData.organization}"
                            )
                            
                            assert(success, message: "Failed to register stakeholder")
                        }
                    }
                `,
                args: [],
            });

            expect(result.status).toBe('SEALED');
            expect(mockFlowSDK.sendTransaction).toHaveBeenCalledTimes(1);
        });

        it('should update stakeholder profile', async () => {
            const updateData = {
                address: '0x1234567890abcdef',
                name: 'Updated Name',
                email: 'updated@example.com',
                organization: 'Updated Organization',
            };

            mockFlowSDK.sendTransaction.mockResolvedValue({
                id: 'test-transaction-id',
                status: 'SEALED',
            });

            const result = await mockFlowSDK.sendTransaction({
                script: `
                    import StakeholderRegistry from ${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry}
                    
                    transaction {
                        prepare(acct: AuthAccount) {
                            let registry = acct.getAccount(${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry})
                                .getCapability<&StakeholderRegistry.RegistryCollection>(/public/StakeholderRegistry)
                                .borrow() ?? panic("Could not borrow StakeholderRegistry")
                            
                            let success = registry.updateStakeholderProfile(
                                address: acct.address,
                                name: "${updateData.name}",
                                email: "${updateData.email}",
                                organization: "${updateData.organization}"
                            )
                            
                            assert(success, message: "Failed to update stakeholder profile")
                        }
                    }
                `,
                args: [],
            });

            expect(result.status).toBe('SEALED');
            expect(mockFlowSDK.sendTransaction).toHaveBeenCalledTimes(1);
        });

        it('should verify stakeholder', async () => {
            const verificationData = {
                address: '0x1234567890abcdef',
                verificationLevel: 'Verified',
                kycCompleted: true,
                amlCompleted: true,
            };

            mockFlowSDK.sendTransaction.mockResolvedValue({
                id: 'test-transaction-id',
                status: 'SEALED',
            });

            const result = await mockFlowSDK.sendTransaction({
                script: `
                    import StakeholderRegistry from ${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry}
                    
                    transaction {
                        prepare(acct: AuthAccount) {
                            let registry = acct.getAccount(${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry})
                                .getCapability<&StakeholderRegistry.RegistryCollection>(/public/StakeholderRegistry)
                                .borrow() ?? panic("Could not borrow StakeholderRegistry")
                            
                            let success = registry.verifyStakeholder(
                                address: acct.address,
                                verificationLevel: StakeholderRegistry.VerificationLevel.Verified,
                                kycCompleted: ${verificationData.kycCompleted},
                                amlCompleted: ${verificationData.amlCompleted}
                            )
                            
                            assert(success, message: "Failed to verify stakeholder")
                        }
                    }
                `,
                args: [],
            });

            expect(result.status).toBe('SEALED');
            expect(mockFlowSDK.sendTransaction).toHaveBeenCalledTimes(1);
        });

        it('should record property ownership', async () => {
            const ownershipData = {
                propertyID: 1,
                owner: '0x1234567890abcdef',
                ownershipPercentage: 100.0,
                acquisitionPrice: 1000.0,
            };

            mockFlowSDK.sendTransaction.mockResolvedValue({
                id: 'test-transaction-id',
                status: 'SEALED',
            });

            const result = await mockFlowSDK.sendTransaction({
                script: `
                    import StakeholderRegistry from ${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry}
                    
                    transaction {
                        prepare(acct: AuthAccount) {
                            let registry = acct.getAccount(${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry})
                                .getCapability<&StakeholderRegistry.RegistryCollection>(/public/StakeholderRegistry)
                                .borrow() ?? panic("Could not borrow StakeholderRegistry")
                            
                            let success = registry.recordPropertyOwnership(
                                propertyID: ${ownershipData.propertyID},
                                owner: acct.address,
                                ownershipPercentage: ${ownershipData.ownershipPercentage},
                                acquisitionPrice: ${ownershipData.acquisitionPrice}
                            )
                            
                            assert(success, message: "Failed to record property ownership")
                        }
                    }
                `,
                args: [],
            });

            expect(result.status).toBe('SEALED');
            expect(mockFlowSDK.sendTransaction).toHaveBeenCalledTimes(1);
        });

        it('should get stakeholder profile', async () => {
            mockFlowSDK.executeScript.mockResolvedValue(mockStakeholderProfile);

            const result = await mockFlowSDK.executeScript({
                script: `
                    import StakeholderRegistry from ${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry}
                    
                    pub fun main(address: Address): StakeholderRegistry.StakeholderProfile? {
                        let registry = getAccount(${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry})
                            .getCapability<&StakeholderRegistry.RegistryCollection>(/public/StakeholderRegistry)
                            .borrow() ?? panic("Could not borrow StakeholderRegistry")
                        
                        return registry.getStakeholderProfile(address: address)
                    }
                `,
                args: ['0x1234567890abcdef'],
            });

            expect(result).toEqual(mockStakeholderProfile);
            expect(mockFlowSDK.executeScript).toHaveBeenCalledTimes(1);
        });

        it('should calculate voting power', async () => {
            const expectedVotingPower = 100.0;
            mockFlowSDK.executeScript.mockResolvedValue(expectedVotingPower);

            const result = await mockFlowSDK.executeScript({
                script: `
                    import StakeholderRegistry from ${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry}
                    
                    pub fun main(address: Address): UFix64 {
                        let registry = getAccount(${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry})
                            .getCapability<&StakeholderRegistry.RegistryCollection>(/public/StakeholderRegistry)
                            .borrow() ?? panic("Could not borrow StakeholderRegistry")
                        
                        return registry.calculateVotingPower(address: address)
                    }
                `,
                args: ['0x1234567890abcdef'],
            });

            expect(result).toBe(expectedVotingPower);
            expect(mockFlowSDK.executeScript).toHaveBeenCalledTimes(1);
        });
    });

    describe('GovernanceContract', () => {
        it('should create a new proposal', async () => {
            const proposalData = {
                title: 'Test Proposal',
                description: 'This is a test proposal for governance testing',
                proposer: '0x1234567890abcdef',
                proposalType: 'PropertyRule',
                votingDuration: 86400.0,
                quorumRequired: 10.0,
                executionData: null,
                targetContract: null,
            };

            mockFlowSDK.sendTransaction.mockResolvedValue({
                id: 'test-transaction-id',
                status: 'SEALED',
            });

            const result = await mockFlowSDK.sendTransaction({
                script: `
                    import GovernanceContract from ${MOCK_CONTRACT_ADDRESSES.GovernanceContract}
                    
                    transaction {
                        prepare(acct: AuthAccount) {
                            let governance = acct.getAccount(${MOCK_CONTRACT_ADDRESSES.GovernanceContract})
                                .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                                .borrow() ?? panic("Could not borrow GovernanceContract")
                            
                            let proposalID = governance.createProposal(
                                title: "${proposalData.title}",
                                description: "${proposalData.description}",
                                proposer: acct.address,
                                proposalType: GovernanceContract.ProposalType.PropertyRule,
                                votingDuration: ${proposalData.votingDuration},
                                quorumRequired: ${proposalData.quorumRequired},
                                executionData: nil,
                                targetContract: nil
                            )
                            
                            assert(proposalID > 0, message: "Failed to create proposal")
                        }
                    }
                `,
                args: [],
            });

            expect(result.status).toBe('SEALED');
            expect(mockFlowSDK.sendTransaction).toHaveBeenCalledTimes(1);
        });

        it('should cast a vote on a proposal', async () => {
            const voteData = {
                proposalID: 1,
                voter: '0x1234567890abcdef',
                voteType: 'Yes',
            };

            mockFlowSDK.sendTransaction.mockResolvedValue({
                id: 'test-transaction-id',
                status: 'SEALED',
            });

            const result = await mockFlowSDK.sendTransaction({
                script: `
                    import GovernanceContract from ${MOCK_CONTRACT_ADDRESSES.GovernanceContract}
                    
                    transaction {
                        prepare(acct: AuthAccount) {
                            let governance = acct.getAccount(${MOCK_CONTRACT_ADDRESSES.GovernanceContract})
                                .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                                .borrow() ?? panic("Could not borrow GovernanceContract")
                            
                            let success = governance.castVote(
                                proposalID: ${voteData.proposalID},
                                voter: acct.address,
                                voteType: GovernanceContract.VoteType.Yes
                            )
                            
                            assert(success, message: "Failed to cast vote")
                        }
                    }
                `,
                args: [],
            });

            expect(result.status).toBe('SEALED');
            expect(mockFlowSDK.sendTransaction).toHaveBeenCalledTimes(1);
        });

        it('should execute a proposal', async () => {
            const proposalID = 1;

            mockFlowSDK.sendTransaction.mockResolvedValue({
                id: 'test-transaction-id',
                status: 'SEALED',
            });

            const result = await mockFlowSDK.sendTransaction({
                script: `
                    import GovernanceContract from ${MOCK_CONTRACT_ADDRESSES.GovernanceContract}
                    
                    transaction {
                        prepare(acct: AuthAccount) {
                            let governance = acct.getAccount(${MOCK_CONTRACT_ADDRESSES.GovernanceContract})
                                .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                                .borrow() ?? panic("Could not borrow GovernanceContract")
                            
                            let success = governance.executeProposal(proposalID: ${proposalID})
                            
                            assert(success, message: "Failed to execute proposal")
                        }
                    }
                `,
                args: [],
            });

            expect(result.status).toBe('SEALED');
            expect(mockFlowSDK.sendTransaction).toHaveBeenCalledTimes(1);
        });

        it('should get proposal details', async () => {
            mockFlowSDK.executeScript.mockResolvedValue(mockProposal);

            const result = await mockFlowSDK.executeScript({
                script: `
                    import GovernanceContract from ${MOCK_CONTRACT_ADDRESSES.GovernanceContract}
                    
                    pub fun main(proposalID: UInt64): GovernanceContract.Proposal? {
                        let governance = getAccount(${MOCK_CONTRACT_ADDRESSES.GovernanceContract})
                            .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                            .borrow() ?? panic("Could not borrow GovernanceContract")
                        
                        return governance.getProposal(proposalID: proposalID)
                    }
                `,
                args: [1],
            });

            expect(result).toEqual(mockProposal);
            expect(mockFlowSDK.executeScript).toHaveBeenCalledTimes(1);
        });

        it('should get active proposals', async () => {
            const activeProposals = [1, 2, 3];
            mockFlowSDK.executeScript.mockResolvedValue(activeProposals);

            const result = await mockFlowSDK.executeScript({
                script: `
                    import GovernanceContract from ${MOCK_CONTRACT_ADDRESSES.GovernanceContract}
                    
                    pub fun main(): [UInt64] {
                        let governance = getAccount(${MOCK_CONTRACT_ADDRESSES.GovernanceContract})
                            .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                            .borrow() ?? panic("Could not borrow GovernanceContract")
                        
                        return governance.getActiveProposals()
                    }
                `,
                args: [],
            });

            expect(result).toEqual(activeProposals);
            expect(mockFlowSDK.executeScript).toHaveBeenCalledTimes(1);
        });

        it('should get voting results', async () => {
            const votingResults = {
                yesVotes: 600.0,
                noVotes: 300.0,
                abstainVotes: 100.0,
                totalVotes: 1000.0,
            };
            mockFlowSDK.executeScript.mockResolvedValue(votingResults);

            const result = await mockFlowSDK.executeScript({
                script: `
                    import GovernanceContract from ${MOCK_CONTRACT_ADDRESSES.GovernanceContract}
                    
                    pub fun main(proposalID: UInt64): (UFix64, UFix64, UFix64, UFix64)? {
                        let governance = getAccount(${MOCK_CONTRACT_ADDRESSES.GovernanceContract})
                            .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                            .borrow() ?? panic("Could not borrow GovernanceContract")
                        
                        return governance.getVotingResults(proposalID: proposalID)
                    }
                `,
                args: [1],
            });

            expect(result).toEqual(votingResults);
            expect(mockFlowSDK.executeScript).toHaveBeenCalledTimes(1);
        });

        it('should get total voting power', async () => {
            const totalVotingPower = 10000.0;
            mockFlowSDK.executeScript.mockResolvedValue(totalVotingPower);

            const result = await mockFlowSDK.executeScript({
                script: `
                    import GovernanceContract from ${MOCK_CONTRACT_ADDRESSES.GovernanceContract}
                    
                    pub fun main(): UFix64 {
                        let governance = getAccount(${MOCK_CONTRACT_ADDRESSES.GovernanceContract})
                            .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                            .borrow() ?? panic("Could not borrow GovernanceContract")
                        
                        return governance.getTotalVotingPower()
                    }
                `,
                args: [],
            });

            expect(result).toBe(totalVotingPower);
            expect(mockFlowSDK.executeScript).toHaveBeenCalledTimes(1);
        });
    });

    describe('Integration Tests', () => {
        it('should complete a full governance cycle', async () => {
            // Step 1: Register stakeholder
            mockFlowSDK.sendTransaction.mockResolvedValueOnce({
                id: 'registration-transaction',
                status: 'SEALED',
            });

            // Step 2: Create proposal
            mockFlowSDK.sendTransaction.mockResolvedValueOnce({
                id: 'proposal-transaction',
                status: 'SEALED',
            });

            // Step 3: Cast vote
            mockFlowSDK.sendTransaction.mockResolvedValueOnce({
                id: 'vote-transaction',
                status: 'SEALED',
            });

            // Step 4: Execute proposal
            mockFlowSDK.sendTransaction.mockResolvedValueOnce({
                id: 'execution-transaction',
                status: 'SEALED',
            });

            // Execute the full cycle
            const registrationResult = await mockFlowSDK.sendTransaction({
                script: 'registration script',
                args: [],
            });

            const proposalResult = await mockFlowSDK.sendTransaction({
                script: 'proposal script',
                args: [],
            });

            const voteResult = await mockFlowSDK.sendTransaction({
                script: 'vote script',
                args: [],
            });

            const executionResult = await mockFlowSDK.sendTransaction({
                script: 'execution script',
                args: [],
            });

            expect(registrationResult.status).toBe('SEALED');
            expect(proposalResult.status).toBe('SEALED');
            expect(voteResult.status).toBe('SEALED');
            expect(executionResult.status).toBe('SEALED');
            expect(mockFlowSDK.sendTransaction).toHaveBeenCalledTimes(4);
        });

        it('should handle governance settings updates', async () => {
            const settingsUpdate = {
                minVotingDuration: 172800.0, // 2 days
                maxVotingDuration: 1209600.0, // 14 days
                defaultQuorum: 15.0, // 15%
                minProposalDeposit: 2.0, // 2 FLOW
                executionDelay: 7200.0, // 2 hours
                emergencyThreshold: 60.0, // 60%
            };

            mockFlowSDK.sendTransaction.mockResolvedValue({
                id: 'settings-update-transaction',
                status: 'SEALED',
            });

            const result = await mockFlowSDK.sendTransaction({
                script: `
                    import GovernanceContract from ${MOCK_CONTRACT_ADDRESSES.GovernanceContract}
                    
                    transaction {
                        prepare(acct: AuthAccount) {
                            let governance = acct.getAccount(${MOCK_CONTRACT_ADDRESSES.GovernanceContract})
                                .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                                .borrow() ?? panic("Could not borrow GovernanceContract")
                            
                            governance.updateSettings(
                                minVotingDuration: ${settingsUpdate.minVotingDuration},
                                maxVotingDuration: ${settingsUpdate.maxVotingDuration},
                                defaultQuorum: ${settingsUpdate.defaultQuorum},
                                minProposalDeposit: ${settingsUpdate.minProposalDeposit},
                                executionDelay: ${settingsUpdate.executionDelay},
                                emergencyThreshold: ${settingsUpdate.emergencyThreshold}
                            )
                        }
                    }
                `,
                args: [],
            });

            expect(result.status).toBe('SEALED');
            expect(mockFlowSDK.sendTransaction).toHaveBeenCalledTimes(1);
        });

        it('should handle emergency mode activation', async () => {
            const emergencyProposalID = 1;

            mockFlowSDK.sendTransaction.mockResolvedValue({
                id: 'emergency-activation-transaction',
                status: 'SEALED',
            });

            const result = await mockFlowSDK.sendTransaction({
                script: `
                    import GovernanceContract from ${MOCK_CONTRACT_ADDRESSES.GovernanceContract}
                    
                    transaction {
                        prepare(acct: AuthAccount) {
                            let governance = acct.getAccount(${MOCK_CONTRACT_ADDRESSES.GovernanceContract})
                                .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                                .borrow() ?? panic("Could not borrow GovernanceContract")
                            
                            let success = governance.activateEmergencyMode(proposalID: ${emergencyProposalID})
                            
                            assert(success, message: "Failed to activate emergency mode")
                        }
                    }
                `,
                args: [],
            });

            expect(result.status).toBe('SEALED');
            expect(mockFlowSDK.sendTransaction).toHaveBeenCalledTimes(1);
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid stakeholder registration', async () => {
            mockFlowSDK.sendTransaction.mockRejectedValue(new Error('Stakeholder already exists'));

            await expect(
                mockFlowSDK.sendTransaction({
                    script: 'invalid registration script',
                    args: [],
                })
            ).rejects.toThrow('Stakeholder already exists');
        });

        it('should handle invalid proposal creation', async () => {
            mockFlowSDK.sendTransaction.mockRejectedValue(new Error('Only stakeholders can create proposals'));

            await expect(
                mockFlowSDK.sendTransaction({
                    script: 'invalid proposal script',
                    args: [],
                })
            ).rejects.toThrow('Only stakeholders can create proposals');
        });

        it('should handle invalid vote casting', async () => {
            mockFlowSDK.sendTransaction.mockRejectedValue(new Error('Voting has ended'));

            await expect(
                mockFlowSDK.sendTransaction({
                    script: 'invalid vote script',
                    args: [],
                })
            ).rejects.toThrow('Voting has ended');
        });

        it('should handle proposal execution failures', async () => {
            mockFlowSDK.sendTransaction.mockRejectedValue(new Error('Proposal has not passed'));

            await expect(
                mockFlowSDK.sendTransaction({
                    script: 'invalid execution script',
                    args: [],
                })
            ).rejects.toThrow('Proposal has not passed');
        });
    });

    describe('Performance Tests', () => {
        it('should handle large numbers of stakeholders', async () => {
            const stakeholderCount = 1000;
            const stakeholders = Array.from({ length: stakeholderCount }, (_, i) => ({
                address: `0x${i.toString(16).padStart(40, '0')}`,
                name: `User ${i}`,
                email: `user${i}@example.com`,
                organization: `Organization ${i}`,
            }));

            mockFlowSDK.executeScript.mockResolvedValue(stakeholders.length);

            const result = await mockFlowSDK.executeScript({
                script: `
                    import StakeholderRegistry from ${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry}
                    
                    pub fun main(): UInt32 {
                        let registry = getAccount(${MOCK_CONTRACT_ADDRESSES.StakeholderRegistry})
                            .getCapability<&StakeholderRegistry.RegistryCollection>(/public/StakeholderRegistry)
                            .borrow() ?? panic("Could not borrow StakeholderRegistry")
                        
                        return registry.getTotalRegisteredStakeholders()
                    }
                `,
                args: [],
            });

            expect(result).toBe(stakeholderCount);
            expect(mockFlowSDK.executeScript).toHaveBeenCalledTimes(1);
        });

        it('should handle large numbers of proposals', async () => {
            const proposalCount = 100;
            const proposals = Array.from({ length: proposalCount }, (_, i) => i + 1);

            mockFlowSDK.executeScript.mockResolvedValue(proposals);

            const result = await mockFlowSDK.executeScript({
                script: `
                    import GovernanceContract from ${MOCK_CONTRACT_ADDRESSES.GovernanceContract}
                    
                    pub fun main(): [UInt64] {
                        let governance = getAccount(${MOCK_CONTRACT_ADDRESSES.GovernanceContract})
                            .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                            .borrow() ?? panic("Could not borrow GovernanceContract")
                        
                        return governance.getActiveProposals()
                    }
                `,
                args: [],
            });

            expect(result).toEqual(proposals);
            expect(mockFlowSDK.executeScript).toHaveBeenCalledTimes(1);
        });
    });
});
