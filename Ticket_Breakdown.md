# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Step 1: Support for custom agent ids
To have the ability for facilities to save their custom agent ids, we will need a mapping for the custom agent id against their internal database id. Since the internal database id is for the system's understanding, it should not be exposed to the outside world and facilities should only use their own custom agent ids to generate reports.

#### Acceptance: 
Facility can use their own custom agent ids and link it with their agents.

#### Implementation: 
* Create a new table `AgentInfo` which will store the mapping of the custom agent id against the internal database id. 
Note: In cases where the facility has not provided a custom id for an agent, the custom agent id can be same as the internal database id.

Schema: 
AgentInfo {
    agent_id: string;
    custom_agent_id: string;
    facility_id: string;
}

Assumptions:
1. Assuming an agent can work for more than 1 facility, it makes sense to store the facility_id also. 
2. custom_agent_id by itself cannot be unique since each facility can set their own custom agent id. Hence the combination of custom_agent_id and facility_id should be unique. This means the same facility cannot use the custom agent id more than once.

* Expose a POST API to allow facilities to add custom agent id for an agent.

#### Effort:
1hr for implementation, 0.5hr for testing


### Step 2: Support to get shifts for a given agent
We will create a function `getShiftsByAgentAndFacility(agent_id, facility_id)` which will return all the shifts for the agent for that facility.
Note: Assuming the agent can work for more than 1 facility, it should always check for the current facility id.

This will allow the facility to generate reports for a given agent.

#### Acceptance:
Returns the shift information for a particular agent.

#### Implementation: 
* Create a function `getShiftsByAgentAndFacility(agent_id, facility_id)` to fetch the shifts given the agent id & facility id.

#### Effort:
1.5hr for implementation, 0.5hr for testing


### Step 3: Support to get shifts for the facility
Since we already have a function `getShiftsByFacility` to get shifts for the entire facility, we will continue using the same without any changes.


### Step 4: Generating Report for a given agent
We will create a function `generateReportForAgent(agent_id)` which will generate the report for the given agent based on all the shift information.

#### Acceptance:
Generates the report for the given custom agent id

#### Implementation:
* For the given `custom_agent_id` and `facility_id`, use the `AgentInfo` table to retrieve the internal agent id.
* Use the internal agent id to call `getShiftsByAgentAndFacility(agent_id, facility_id)`
* Use `generateReportForAgent(agent_id)` to generate the pdf report.

#### Effort:
2hr for implementation, 1hr for testing


### Step 5: Generating Report for all agents in facility
We will create a function `generateReports()` which will generate the report for all the agents based on all the shift information.

#### Acceptance:
Generates the report for the all the agents in the facility.

#### Implementation:
* For the given `facility_id`, use the `AgentInfo` table to retrieve all the internal agent ids & their custom ids.
* Call `getShiftsByFacility(facility_id)`. 
* In the `generateReports()` function, replace the agent_id with the custom_agent_id while generating the report.
  
  Note: The idea is to keep a in-memory data structure for the mapping of internal agent id & their custom id. (This can be a HashMap where key is internal_agent_id and value is custom_agent_id). The reason for this is to improve the lookup time and reduce the number of database queries while generating reports. Since a facility can have high number of agents, every db call to figure out the custom_agent_id given their internal_id will be expensive and in-turn increase the latency.

#### Effort:
3hr for implementation, 2hr for testing
